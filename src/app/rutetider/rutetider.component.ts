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
  error :string;

  ngOnInit() {
    this.location = 'Unknown';
    this.position = {latitude: 0, longitude: 0};
    this.stopNumber = 1;
    this.stopsNearBy = [];
    this.geoSupported = true;
    this.error="none";


  }

  findPosition(){

    if(window.navigator.geolocation){
      window.navigator.geolocation.getCurrentPosition(this.handleLocation.bind(this),this.handleError.bind(this));
    }else{
      this.geoSupported=false;
    }
  }

  private handleLocation(position): void {
    console.log(this);
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
    switch(error.code) {
      case error.PERMISSION_DENIED:
        this.error = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        this.error = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        this.error = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        this.error = "An unknown error occurred."
        break;
    }
  }


}
