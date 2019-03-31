import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {NavigationStart, Router} from '@angular/router';
import * as localforage from 'localforage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-first-angular';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      'bus',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/bus.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'train',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/trainn.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'subway',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/subway.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'tram',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/tram1.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'arrow',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/arrow.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'rotate',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/rotate.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'heart',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/outline-favorite-24px.svg')
    );
    localforage.config({
      driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
      name        : 'Ruter',
      version     : 1.0,
      size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName   : 'ruter-favorites', // Should be alphanumeric, with underscores.
      description : 'Save the favorite stops'
    });
  }


}
