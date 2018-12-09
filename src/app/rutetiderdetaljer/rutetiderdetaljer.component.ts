import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {RutetiderService} from '../rutetider.service';
import {Departure} from '../departure';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {parse} from 'date-fns'
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-rutetiderdetaljer',
  templateUrl: './rutetiderdetaljer.component.html',
  styleUrls: ['./rutetiderdetaljer.component.css']
})
export class RutetiderdetaljerComponent implements OnInit{


  departures: Departure[];
  id:string;

  constructor(
    private ruteTiderService: RutetiderService,
    private route: ActivatedRoute,
    private spinner:NgxSpinnerService,
    private location: Location) {
  }



  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    this.fetchData();

  }

  refresh(){
    this.fetchData();
  }

  fetchData(){
    this.spinner.show();
    this.ruteTiderService.getRutetider(this.id).subscribe((rutetider) => {

      this.departures = rutetider['data']['stopPlace']['estimatedCalls'];

      this.calcArrival()
      //this.removeDuplicates()
      this.spinner.hide();

    });
  }

  calcArrival(){
    let now = new Date();
    let min: number;
    let hour: number;
    // calculate actual arrival time;
    for (let departure of this.departures) {
      let idNumber = departure.serviceJourney.journeyPattern.line.id.match(/\d+/g);
      departure.bussNumber=idNumber[0];

      departure.expectedArrivalTime = parse(departure.expectedArrivalTime);
      departure.aimedArrivalTime = parse(departure.aimedArrivalTime);

      min = departure.expectedArrivalTime.getMinutes() - now.getMinutes();
      hour = departure.expectedArrivalTime.getHours() - now.getHours();
      if (hour >0) {
        departure.arrival = hour*60 + min + 'm';
      }
      else if (min == 0 ) {
        departure.arrival = departure.expectedArrivalTime.getSeconds() - now.getSeconds() + 's';
      } else {
        departure.arrival = min + 'm';
      }
    }
  }

  removeDuplicates(){
    let newArray:Departure[];
    newArray=[];
    while(this.departures.length>0){
      let departure=this.departures[0];
      let name1=this.departures[0].destinationDisplay.frontText;
      let count=1;

      for(let j = 1;j<this.departures.length;j++){

        let name2=this.departures[j].destinationDisplay.frontText;

        if(name1==name2){

          departure.arrival+=' ,'+this.departures[j].arrival;
          this.departures.splice(j,j+1);
          j-=1;
          count++;
        }
      }
      this.departures.splice(0,1);
      console.log(name1,count);
      newArray.push(departure);

    }

    this.departures=newArray;

  }

  goBack(){
    this.location.back();
  }

}


