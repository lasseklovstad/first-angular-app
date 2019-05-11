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

  searchUrl = 'https://api.entur.io/geocoder/v1/autocomplete';

  getLocation(longitude: string, latitude: string): Observable<GeoLocation> {

    let headers = new HttpHeaders().set('ET-Client-Name', 'experis-academy-test');
    let params = new HttpParams()
      .append('point.lat', latitude)
      .append('layers', 'venue')
      .append('size', '20')
      .append('point.lon', longitude);


    return this.http.get<GeoLocation>(this.url, {headers: headers, params: params});
  }

  searchLocation(longitude: string, latitude: string, search: string): Observable<GeoLocation> {
    let headers = new HttpHeaders().set('ET-Client-Name', 'experis-academy-test');
    let params = new HttpParams()
      .append('focus.point.lat', latitude)
      .append('layers', 'venue')
      .append('size', '20')
      .append('boundary.county_ids', '01,02,03,04,05,06,07,08')
      .append('text', search)
      .append('focus.point.lon', longitude);

    return this.http.get<GeoLocation>(this.searchUrl, {headers: headers, params: params});
  }

}
