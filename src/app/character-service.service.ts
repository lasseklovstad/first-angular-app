import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Character} from './models/Character';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterServiceService {

  constructor(private http: HttpClient) {
  }


  getCharacters(id: number): Observable<Character> {
    const url = 'http://anapioficeandfire.com/api/characters/583';
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<Character>(url, {headers: headers});

  }
}
