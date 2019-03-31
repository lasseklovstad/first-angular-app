import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Departure} from './departure';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RutetiderService {

  constructor(private http:HttpClient) {}

  url="https://api.entur.org/journeyplanner/2.0/index/graphql";

  getRutetider(id:string):Observable<Object>{
    let date = new Date();
    let body = {"query":"# Avgangstavle - Stavanger stadion\n\n{\n  stopPlace(id: \""+id+"\") {\n    id\n    name\n    estimatedCalls(startTime:\""+date.toISOString()+"\" timeRange: 72100, numberOfDepartures: 10) {     \n      realtime\n      aimedArrivalTime\n      aimedDepartureTime\n      expectedArrivalTime\n      expectedDepartureTime\n      actualArrivalTime\n      actualDepartureTime\n      date\n      forBoarding\n      forAlighting\n      destinationDisplay {\n        frontText\n      }\n      quay {\n        id\n publicCode\n name\n description\n     }\n      serviceJourney {\n        journeyPattern {\n          line {\n            id\n            name\n            transportMode\n          }\n        }\n      }\n    }\n  }\n}\n","variables":null}
    let headers = new HttpHeaders().set('ET-Client-Name', 'experis-academy-test');
    return this.http.post<Object>(this.url,body,{headers:headers});
  }
}
