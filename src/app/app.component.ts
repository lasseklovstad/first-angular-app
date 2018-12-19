import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {NavigationStart, Router} from '@angular/router';

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
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/train.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'subway',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/subway.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'tram',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/tram1.svg')
    );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        window.localStorage.setItem('lastUrl', event.url);
      }
    });

    this.router.navigate([window.localStorage.getItem('lastUrl')]);

  }


}
