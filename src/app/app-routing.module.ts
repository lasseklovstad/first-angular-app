import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CharacterListComponent} from './character-list/character-list.component';

const routes: Routes = [
  {path: '', component: CharacterListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
