import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Character} from './models/Character';
import {Observable} from 'rxjs';
import {Post} from './models/post';

@Injectable({
  providedIn: 'root'
})
export class CharacterServiceService {

  constructor(private http: HttpClient) {
  }


  getCharacters(): Observable<Post[]> {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    return this.http.get<Post[]>(url);

  }
}
