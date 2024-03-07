import { Component } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatCalendar } from '@angular/material/datepicker';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserWorkoutsComponent } from './user-workouts.component';
import { UserService } from '../services/user.service';
import { User } from '../models';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div *ngIf="loadedUsers$ | async as loadedUsers; else loading">
      <app-user-workouts *ngFor="let user of loadedUsers" [user]="user" />
      <div *ngIf="error" style="color: red;">Error loading users</div>
    </div>
    <ng-template #loading>
      <mat-spinner style="margin: 0 auto"></mat-spinner>
    </ng-template>
  `,
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCalendar,
    MatCardContent,
    MatToolbar,
    NgIf,
    RouterLink,
    UserWorkoutsComponent,
    NgForOf,
    MatProgressSpinner,
  ],
})
export class HomeComponent {
  loadedUsers: User[] | undefined;
  error: boolean = false;

  constructor(private userService: UserService) {}

  loadedUsers$: Observable<User[] | undefined> = this.userService
    .fetchUsers()
    .pipe(
      catchError((err) => {
        console.error('Error loading users', err);
        this.error = true;
        return of(undefined);
      })
    );
}
