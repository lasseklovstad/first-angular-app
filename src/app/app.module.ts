import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RutetiderComponent } from './rutetider/rutetider.component';
import {HttpClientModule} from '@angular/common/http';
import { RutetiderdetaljerComponent } from './rutetiderdetaljer/rutetiderdetaljer.component';

@NgModule({
  declarations: [
    AppComponent,
    RutetiderComponent,
    RutetiderdetaljerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
