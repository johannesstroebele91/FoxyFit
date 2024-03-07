import {Component, OnInit} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatCalendar} from "@angular/material/datepicker";
import {MatToolbar} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserWorkoutsComponent} from "./user-workouts.component";
import {UserService} from "../services/user.service";
import {User} from "../models";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-home', standalone: true,
  template: `
    <mat-spinner *ngIf="!loadedUsers" style="margin: 0 auto"></mat-spinner>
    <div *ngIf="loadedUsers">
      <app-user-workouts *ngFor="let user of loadedUsers" [user]="user"></app-user-workouts>
    </div>
  `,
  imports: [
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
    MatProgressSpinner
  ]
})
export class HomeComponent implements OnInit {
  loadedUsers: User[] | undefined;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.fetchUsers().subscribe({
      next: (users: User[]) => {
        this.loadedUsers = users;
      },
      error: (error) => {
        console.log('Error loading user' + error.errorMessage)
      }
    });
  }
}
