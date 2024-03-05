import {Component, OnInit} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatCalendar} from "@angular/material/datepicker";
import {MatToolbar} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserWorkoutsComponent} from "./user-workouts.component";

function generateDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  dates.push(today);

  for (let i = 1; i <= 3; i++) {
    const previousDate = new Date(today);
    previousDate.setDate(today.getDate() - i);
    dates.push(previousDate);
  }

  return dates;
}

const USERS_WORKOUTS: Date[][] = [
  generateDates(), generateDates(), generateDates()
];

// Accessing elements
console.log(USERS_WORKOUTS);

@Component({
  selector: 'app-home', standalone: true,
  template: `
    <app-user-workouts *ngFor="let userWorkouts of usersWorkouts" [workouts]="userWorkouts"></app-user-workouts>
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
    NgForOf
  ]
})
export class HomeComponent implements OnInit {
  usersWorkouts: Date[][] = USERS_WORKOUTS;

  ngOnInit(): void {

  }
}
