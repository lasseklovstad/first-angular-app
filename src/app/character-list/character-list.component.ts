import {Component, OnInit} from '@angular/core';
import {CharacterServiceService} from '../character-service.service';
import {Character} from '../models/Character';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {

  constructor(private characterService: CharacterServiceService) {
  }

  characterList: Character[] = [];

  ngOnInit() {
    this.fetchCharacters();
    this.characterList = [];
  }

  private fetchCharacters() {
    this.characterService.getCharacters(2).subscribe(res => {
      this.characterList.push(res);
    });
  }

}
