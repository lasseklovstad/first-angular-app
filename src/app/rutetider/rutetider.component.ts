import {Component, OnInit} from '@angular/core';
import {GeolocatorService} from '../geolocator.service';
import {Position} from '../position';

@Component({
  selector: 'app-rutetider',
  templateUrl: './rutetider.component.html',
  styleUrls: ['./rutetider.component.css']
})
export class RutetiderComponent implements OnInit {

  constructor(private locationService: GeolocatorService) {


  }

  location: String;
  stopNumber: Number;
  position: Position;
  date = new Date();
  stopsNearBy: Location[];
  geoSupported: boolean;
  array=[1,2,3,4,5,6,7];

  ngOnInit() {
    this.location = 'Unknown';
    this.position = {latitude: 0, longitude: 0};
    this.stopNumber = 1;
    this.stopsNearBy = [];
    this.geoSupported = true;
    navigator.geolocation.getCurrentPosition(this.handleLocation.bind(this),this.handleError.bind(this));


  }

  private handleLocation(position): void {
    this.position = position.coords;
    this.locationService.getLocation(position.coords.longitude, position.coords.latitude).subscribe((response) => {
      for (let location of response.features) {
        this.stopsNearBy.push(location.properties);
      }


    });

  }
  private handleError(error){
    if(error.code==1){
      this.geoSupported=false;
    }
  }


}
