import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RutetiderComponent} from './rutetider/rutetider.component';
import {RutetiderdetaljerComponent} from './rutetiderdetaljer/rutetiderdetaljer.component';
import {TryToggleComponent} from './try-toggle/try-toggle.component';
import {FavouriteComponent} from './favourite/favourite.component';

const routes: Routes = [
  {path: 'location/:id', component: RutetiderdetaljerComponent},
  {path: '', component: RutetiderComponent},
  {path: 'favorite', component: FavouriteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
