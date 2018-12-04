import {Component, OnInit} from '@angular/core';
import {GeolocatorService} from '../geolocator.service';
import {Position} from '../position';
import {Observable} from 'rxjs';

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
  selectedStop:Location;

  ngOnInit() {
    this.location = 'Unknown';
    this.position = {latitude: 0, longitude: 0};
    this.stopNumber = 1;
    this.stopsNearBy = [];
    this.geoSupported = true;
    this.error="none";

    navigator.geolocation.getCurrentPosition(this.handleLocation.bind(this),this.handleError.bind(this));
    //setInterval(()=>navigator.geolocation.getCurrentPosition(this.handleLocation.bind(this),this.handleError.bind(this)),10*1000);


  }

  onSelect(stop:Location){
    this.selectedStop=stop;
  }



  private handleLocation(position): void {
    this.date = new Date();
    this.stopsNearBy=[];
    this.position = position.coords;
    this.locationService.getLocation(position.coords.longitude, position.coords.latitude).subscribe((response) => {
      for (let location of response.features) {
        this.stopsNearBy.push(location.properties);
      }
      //sort array by distance
      this.stopsNearBy.sort((a,b)=>(a['distance']<b['distance'])?-1:0);

      //find type
      for(let stop of this.stopsNearBy){
        stop['type']="";
        for(let type of stop['category']){
          switch(type){
            case "onstreetBus":stop['type']+="Bus, ";break;
            case "onstreetTram":stop['type']+="Tram, ";break;
            case "metroStati":stop['type']+="Subway, ";break;
            default:stop['type']+=type;
          }
        }
        // remove last ,
        stop['type']=(String)(stop['type']).slice(0,stop['type'].length-2)
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
