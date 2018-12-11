import {Component, OnInit} from '@angular/core';
import {CharacterServiceService} from '../character-service.service';
import {Character} from '../models/Character';
import {Post} from '../models/post';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {

  constructor(private characterService: CharacterServiceService) {
  }

  postList: Post[] = [];

  ngOnInit() {
    this.fetchCharacters();
  }

  private fetchCharacters() {
    this.characterService.getCharacters().subscribe(res => {
      this.postList = res;
    });
  }

}
