import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton],
  template: `
    <div style="margin: 12px">
      <h1>Welcome to {{ title }}!</h1>
      <button mat-stroked-button color="primary">Test</button>
      <router-outlet/>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'FoxyFit';
}
