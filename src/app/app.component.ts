import {Component} from "@angular/core";
import {MatNativeDateModule} from "@angular/material/core";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCalendar} from "@angular/material/datepicker";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, MatNativeDateModule, RouterOutlet, MatButton, MatCalendar, MatIcon, MatMenuTrigger, MatIconButton, MatMenu, MatCard, MatCardTitle, MatCardHeader, MatCardContent, MatToolbar, RouterLink, NgIf],
  template: `
    <mat-toolbar color="primary">
      <mat-toolbar-row>
        <span style="letter-spacing: 1.2px">{{ title }}<span class="material-icons"
                                                             style="font-size: 18px; margin-left: 3px">
directions_run
</span></span>
        <span style="flex: 1 1 auto;"></span>
        <a *ngIf="isNotHomeRoute()" routerLink="/" (click)="logout()"
           style="color: white; text-decoration: none; font-size: 16px">Logout</a>
      </mat-toolbar-row>
    </mat-toolbar>
    <div style="max-width: 600px; margin: 60px auto;">
      <router-outlet></router-outlet>
    </div>

  `,
})
export class AppComponent {
  title = 'FoxyFit';

  constructor(private router: Router, private authService: AuthService) {
  }

  isNotHomeRoute(): boolean {
    return this.router.url !== '/';
  }

  logout() {
    this.authService.logout()
  }
}
