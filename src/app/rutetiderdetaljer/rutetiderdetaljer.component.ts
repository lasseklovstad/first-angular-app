import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {RutetiderService} from '../rutetider.service';
import {Departure} from '../departure';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {parse} from 'date-fns';
import {NgxSpinnerService} from 'ngx-spinner';
import * as localforage from 'localforage';

@Component({
  selector: 'app-rutetiderdetaljer',
  templateUrl: './rutetiderdetaljer.component.html',
  styleUrls: ['./rutetiderdetaljer.component.css']
})
export class RutetiderdetaljerComponent implements OnInit {


  departures: { stop: any, departures: Departure[] }[] = null;
  id: string;
  name: string;
  favorite = false;
  show: boolean[];

  constructor(
    private ruteTiderService: RutetiderService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private location: Location) {
  }


  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    this.fetchData();

    setInterval(() => {
      this.fetchData();
    }, 1000 * 30);

    localforage.getItem('favorites').then((favorites: { name: string, id: string }[]) => {
      for (const favorite of favorites) {
        if (favorite.id === this.id) {
          this.favorite = true;
        }
      }
    });

  }

  public addToFavorites(): void {
    const stop = this.route.snapshot.paramMap.get('id');

    localforage.getItem('favorites').then((favorites: { name: string, id: string }[]) => {
      let index = -1;
      let currentIndex = 0;
      for (const favorite of favorites) {
        if (favorite.id === this.id) {
          index = currentIndex;
        }
        currentIndex++;
      }

      if (index === -1) {
        favorites.push({name: this.name, id: this.id});
        localforage.setItem('favorites', favorites).then(() => {
          this.favorite = true;
          console.log('Add', favorites);
        });


      } else {
        favorites.splice(index, 1);
        localforage.setItem('favorites', favorites).then(() => {
          this.favorite = false;
          console.log('Remove', favorites);
        });

      }
    }).catch(() => {
      localforage.setItem('favorites', [{name: this.name, id: this.id}]);
      this.favorite = true;
    });

  }

  refresh() {
    this.fetchData();
  }

  fetchData() {
    this.spinner.show();

    this.ruteTiderService.getStops(this.id).subscribe((response) => {
      const stops = response['data']['stopPlace']['quays'];
      this.name = response['data']['stopPlace'].name;

      const stopsId = stops.map((stop) => {
        return stop.id;
      });
      this.ruteTiderService.getRutetiderFromStops(stopsId).subscribe((rutetider) => {
        const rutetiderAtStops = rutetider['data']['quays'];

        const departureAtStops = [];
        let departure = [];
        for (let i = 0; i < rutetiderAtStops.length; i++) {
          departure = rutetiderAtStops[i]['estimatedCalls'];
          departure = this.calcArrival(departure);
          departure = this.removeDuplicates(departure);
          if (departure.length > 0) {
            departureAtStops.push({stop: stops[i], departures: departure});
          }

        }

        this.departures = departureAtStops;
        this.sortStops(this.departures);
        if (!this.show) {
          if (this.departures.length > 2) {
            this.show = this.departures.map(() => false);
          } else {
            this.show = this.departures.map(() => true);
          }

        }
        this.spinner.hide();
      });

    });

  }

  calcArrival(departures) {
    const now = new Date();
    // calculate actual arrival time;
    for (const departure of departures) {
      const idNumber = departure.serviceJourney.line.id.match(/\d+/g);
      departure.bussNumber = idNumber[0];

      departure.expectedDepartureTime = parse(departure.expectedDepartureTime);
      departure.aimedDepartureTime = parse(departure.aimedDepartureTime);

      const diffTime = Math.abs(departure.expectedDepartureTime.getTime() - now.getTime());
      const diffMins = Math.floor(diffTime / (1000 * 60));
      const diffSecs = Math.ceil(diffTime / (1000));

      if (diffMins > 0) {
        departure.arrival = diffMins + 'm';
      } else {
        departure.arrival = diffSecs + 's';
      }
    }
    return departures;
  }

  removeDuplicates(departures) {
    let newArray: Departure[];
    newArray = [];
    while (departures.length > 0) {
      const departure = departures[0];
      const name1 = departure.destinationDisplay.frontText;
      let count = 1;

      for (let j = 1; j < departures.length; j++) {
        const name2 = departures[j].destinationDisplay.frontText;

        if (name1 === name2) {

          departure.arrival += ' ,' + departures[j].arrival;
          departures.splice(j, 1);
          j -= 1;
          count++;
        }
      }
      departures.splice(0, 1);
      newArray.push(departure);

    }

    return newArray;

  }

  sortStops(departures) {
    departures.sort((a, b) => {
      return a.stop.id.match(/\d+/g) - b.stop.id.match(/\d+/g);
    });
  }

  goBack() {
    this.location.back();
  }

  public showRutetider(index: number): void {
    this.show[index] = !this.show[index];
  }

}


