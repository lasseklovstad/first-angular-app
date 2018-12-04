import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {RutetiderService} from '../rutetider.service';
import {Departure} from '../departure';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {parse} from 'date-fns'

@Component({
  selector: 'app-rutetiderdetaljer',
  templateUrl: './rutetiderdetaljer.component.html',
  styleUrls: ['./rutetiderdetaljer.component.css']
})
export class RutetiderdetaljerComponent implements OnInit{


  departures: Departure[];


  constructor(
    private ruteTiderService: RutetiderService,
    private route: ActivatedRoute,
    private location: Location) {
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.ruteTiderService.getRutetider(id).subscribe((rutetider) => {

      this.departures = rutetider['data']['stopPlace']['estimatedCalls'];
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
        if (hour == 1) {
          departure.arrival = 60 + min + 'm';
        }
        else if (min == 0 && hour == 0) {
          departure.arrival = departure.expectedArrivalTime.getSeconds() - now.getSeconds() + 's';
        } else {
          departure.arrival = min + 'm';
        }
      }


    });
  }

  goBack(){
    this.location.back();
  }

}


