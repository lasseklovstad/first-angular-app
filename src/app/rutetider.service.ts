import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Departure} from './departure';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RutetiderService {

  constructor(private http: HttpClient) {
  }

  url = 'https://api.entur.org/journeyplanner/2.0/index/graphql';

  getRutetider(id: string): Observable<Object> {
    let date = new Date();
    let body = {
      'query': '# Avgangstavle - Stavanger stadion\n\n{\n  stopPlace(id: "' + id + '") {\n    id\n    name\n    estimatedCalls(startTime:"' + date.toISOString() + '" timeRange: 72100, numberOfDepartures: 10) {     \n      realtime\n      aimedArrivalTime\n      aimedDepartureTime\n      expectedArrivalTime\n      expectedDepartureTime\n      actualArrivalTime\n      actualDepartureTime\n      date\n      forBoarding\n      forAlighting\n      destinationDisplay {\n        frontText\n      }\n      quay {\n        id\n publicCode\n name\n description\n     }\n      serviceJourney {\n        journeyPattern {\n          line {\n            id\n            name\n            transportMode\n          }\n        }\n      }\n    }\n  }\n}\n',
      'variables': null
    };
    let headers = new HttpHeaders().set('ET-Client-Name', 'experis-academy-test');
    return this.http.post<Object>(this.url, body, {headers: headers});
  }

  getStops(id: string): Observable<Object> {
    const url = 'https://api.entur.io/journey-planner/v2/graphql';


    const body = {
      query: 'query ($id: String!, $filterByInUse: Boolean) { stopPlace (id: $id) { id name description latitude longitude wheelchairBoarding weighting transportMode transportSubmode quays (filterByInUse: $filterByInUse) { id name publicCode description situations { situationNumber summary { value } description { value } detail { value } validityPeriod { startTime endTime } reportType infoLink } } } }',
      variables: {
        id: id,
        filterByInUse: false
      }
    };

    const headers = new HttpHeaders().set('ET-Client-Name', 'experis-academy-test');
    return this.http.post<Object>(url, body, {headers: headers});
  }

  public getRutetiderFromStops(ids: string[]): Observable<Object> {
    const url = 'https://api.entur.io/journey-planner/v2/graphql';
    const date = new Date();
    const body = {
      query: 'query ($ids: [String]!, $start: DateTime!, $timeRange: Int!, $limit: Int!, $omitNonBoarding: Boolean!) { quays (ids: $ids) { id estimatedCalls (startTime: $start, timeRange: $timeRange, numberOfDepartures: $limit, omitNonBoarding: $omitNonBoarding) { date forBoarding requestStop forAlighting destinationDisplay { frontText } notices { text } aimedDepartureTime expectedDepartureTime realtime situations { situationNumber summary { value } description { value } detail { value } validityPeriod { startTime endTime } reportType infoLink } quay { id name publicCode description } serviceJourney { id publicCode transportSubmode journeyPattern { line { notices { text } } notices { text } } notices { text } line { id name publicCode notices { text } transportMode description } } } } }',
      variables: {
        ids: ids,
        start: date.toISOString(),
        omitNonBoarding: true,
        timeRange: 2000,
        limit: 30
      }
    };
    const headers = new HttpHeaders().set('ET-Client-Name', 'experis-academy-test');
    return this.http.post<Object>(url, body, {headers: headers});
  }

}
