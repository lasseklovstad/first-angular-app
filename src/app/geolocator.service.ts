import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GeoLocation} from './geoLocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocatorService {

  constructor(private http: HttpClient) {
  }

  url = 'https://api.entur.org/api/geocoder/1.1/reverse';

  getLocation(longitude: string, latitude: string):Observable<GeoLocation>{

    let headers = new HttpHeaders().set('ET-Client-Name', 'experis-academy-test');
    let params = new HttpParams()
      .append('point.lat', latitude)
      .append('layers', 'venue')
      .append('point.lon', longitude);


    return this.http.get<GeoLocation>(this.url, {headers: headers, params: params})
  }

}
