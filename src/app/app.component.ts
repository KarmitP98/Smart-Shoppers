import { Component } from '@angular/core';
import { opacityLoadTrigger } from './shared/animations';

@Component( {
              selector: 'app-root',
              templateUrl: './app.component.html',
              styleUrls: [ './app.component.css' ],
              animations: [ opacityLoadTrigger ]
            } )
export class AppComponent {
  title = 'Smart-Shoppers';
}
