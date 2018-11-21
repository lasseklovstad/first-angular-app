import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Exchange} from './exchange';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Books';
  result:Exchange;
  id:number;

  constructor(private http: HttpClient){

  }

  refreshData():void{

    this.http.get<Exchange>("http://api.football-data.org/v2/teams/"+this.id,
      {headers:{"X-Auth-Token":"f3cb0631432944ba973ff3214dfbcb83"}}).subscribe(
      (data)=>this.result=data
    )
  }

  ngOnInit():void{
    this.id=1;
    this.refreshData();

  }

}
