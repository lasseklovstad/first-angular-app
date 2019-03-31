import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import * as localforage from 'localforage';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent implements OnInit {

  public favorites: { name: string, id: string }[];

  constructor(private location: Location) {
  }

  ngOnInit() {
    localforage.getItem('favorites').then((favorites: { name: string, id: string }[]) => {
      this.favorites = favorites;
    });
  }

  goBack() {
    this.location.back();
  }

}
