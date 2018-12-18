import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RutetiderComponent} from './rutetider/rutetider.component';
import {HttpClientModule} from '@angular/common/http';
import {RutetiderdetaljerComponent} from './rutetiderdetaljer/rutetiderdetaljer.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatBadgeModule,
  MatButtonModule,
  MatChipsModule, MatGridListModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';
import { TryToggleComponent } from './try-toggle/try-toggle.component';

@NgModule({
  declarations: [
    AppComponent,
    RutetiderComponent,
    RutetiderdetaljerComponent,
    TryToggleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
