import {Component, OnInit} from '@angular/core';
import {GeolocatorService} from '../geolocator.service';
import {Position} from '../position';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-rutetider',
  templateUrl: './rutetider.component.html',
  styleUrls: ['./rutetider.component.css']
})
export class RutetiderComponent implements OnInit {

  constructor(private locationService: GeolocatorService,
              private spinner: NgxSpinnerService) {

  }

  location: String;
  stopNumber: Number;
  position: Position;
  date = new Date();
  stopsNearBy: Location[];
  geoSupported: boolean;
  error: string;
  selectedStop: Location;

  searchTerm: Subject<string>;
  searchTermValue = '';
  subscription: Subscription;

  ngOnInit() {
    this.spinner.show();
    this.location = 'Unknown';
    this.position = {latitude: 0, longitude: 0};
    this.stopNumber = 1;
    this.stopsNearBy = [];
    this.geoSupported = true;
    this.error = 'none';

    navigator.geolocation.getCurrentPosition(this.handleLocation.bind(this), this.handleError.bind(this));
    this.searchTerm = new Subject();
    this.subscription = this.searchTerm.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(500),

      // ignore new term if same as previous term
      distinctUntilChanged()
    ).subscribe((value) => {
      this.searchTermValue = value;
      navigator.geolocation.getCurrentPosition(this.handleLocationSearch.bind(this), this.handleError.bind(this));
    });


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private handleLocationSearch(position): void {
    if(this.searchTermValue.trim() === '' ){
      return;
    }
    this.date = new Date();
    this.stopsNearBy = [];
    this.position = position.coords;
    this.locationService.searchLocation(position.coords.longitude, position.coords.latitude, this.searchTermValue).subscribe((response) => {
      this.processStops(response);
    });


  }

  onSelect(stop: Location) {
    this.selectedStop = stop;
  }

  refresh() {
    navigator.geolocation.getCurrentPosition(this.handleLocation.bind(this), this.handleError.bind(this));
  }

  search(value: string) {
    this.searchTerm.next(value);
  }

  private handleLocation(position): void {
    this.date = new Date();
    this.stopsNearBy = [];
    this.position = position.coords;
    this.locationService.getLocation(position.coords.longitude, position.coords.latitude).subscribe((response) => {
      this.processStops(response);
    });


  }

  processStops(response) {
    for (const location of response.features) {
      this.stopsNearBy.push(location.properties);
    }
    // sort array by distance
    this.stopsNearBy.sort((a, b) => (a['distance'] < b['distance']) ? -1 : 0);

    // find type
    for (let stop of this.stopsNearBy) {
      stop['type'] = '';
      for (let type of stop['category']) {
        switch (type) {
          case 'onstreetBus':
            stop['type'] += 'Bus, ';
            break;
          case 'onstreetTram':
            stop['type'] += 'Tram, ';
            break;
          case 'metroStation':
            stop['type'] += 'Subway, ';
            break;
          case 'railStation':
            stop['type'] += 'Train, ';
            break;
          default:
            stop['type'] += type;
        }
      }
      // remove last ,
      stop['type'] = (String)(stop['type']).slice(0, stop['type'].length - 2);
    }
    this.spinner.hide();
  }

  private handleError(error) {
    if (error.code == 1) {
      this.geoSupported = false;

    }
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.error = 'User denied the request for Geolocation.';
        break;
      case error.POSITION_UNAVAILABLE:
        this.error = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        this.error = 'The request to get user location timed out.';
        break;
      case error.UNKNOWN_ERROR:
        this.error = 'An unknown error occurred.';
        break;
    }
  }


}
