import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CharacterListComponent} from './character-list/character-list.component';


import {RutetiderComponent} from './rutetider/rutetider.component';
import {RutetiderdetaljerComponent} from './rutetiderdetaljer/rutetiderdetaljer.component';

const routes: Routes = [
  {path: 'location/:id', component: RutetiderdetaljerComponent},
  {path: '', component: RutetiderComponent},
  {path: 'test', component: CharacterListComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
