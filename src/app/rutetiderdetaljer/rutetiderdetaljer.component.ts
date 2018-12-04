import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {RutetiderService} from '../rutetider.service';
import {Departure} from '../departure';

@Component({
  selector: 'app-rutetiderdetaljer',
  templateUrl: './rutetiderdetaljer.component.html',
  styleUrls: ['./rutetiderdetaljer.component.css']
})
export class RutetiderdetaljerComponent implements OnInit, OnChanges {

  @Input() stop: Location;
  departures: Departure[];


  constructor(private ruteTiderService: RutetiderService) {
  }

  ngOnInit() {


  }

  ngOnChanges(): void {
    if (this.stop != null) {
      this.ruteTiderService.getRutetider(this.stop['id']).subscribe((rutetider) => {

        this.departures = rutetider['data']['stopPlace']['estimatedCalls'];
        let now = new Date();
        let min: number;
        let hour: number;
// calculate actual arrival time;
        for (let departure of this.departures) {
          departure.expectedArrivalTime = new Date(departure.expectedArrivalTime);
          departure.aimedArrivalTime=new Date(departure.aimedArrivalTime)

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
  }

}
