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
  stoppNumber: Number;
  position:Position;
  date = new Date();
  stopsNearBy:Location[];


  ngOnInit() {
    this.location="Unknown";
    this.position={latitude:0,longitude:0};
    this.stoppNumber=1;
    this.stopsNearBy=[];
    navigator.geolocation.getCurrentPosition(this.handleLocation.bind(this));



  }
  private handleLocation(position):void{
   this.position=position.coords;
   this.locationService.getLocation(position.coords.longitude,position.coords.latitude).subscribe((response)=>{
     for(let location of response.features){
       this.stopsNearBy.push(location.properties);
     }
     

   })

  }



}
