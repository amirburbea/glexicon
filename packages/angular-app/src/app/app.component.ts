import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly tabs = { home: '/home', examine: '/examine' };

  readonly title = 'gLexicon';
}
