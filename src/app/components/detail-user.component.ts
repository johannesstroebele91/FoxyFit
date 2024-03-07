import {Component, OnInit} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {User} from "../models";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCalendar, MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {calculateHighlightedUserWorkouts} from "../shared/utils";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {UserService} from "../services/user.service";
import {NgIf} from "@angular/common";
import {WORKOUT_DATA} from "../shared/mock-data";


@Component({
  selector: 'app-detail-user',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    MatCardContent,
    MatCalendar,
    MatProgressSpinner,
    MatIcon,
    MatIconButton,
    RouterLink,
    NgIf
  ],
  styles: [`
    ::ng-deep .workout-day {
      background-color: #b6eea7 !important;
      border-radius: 60px;
    }

    .distribute-vertically {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: space-evenly;
      align-items: center;
      align-content: stretch;
    }
  `],
  template: `
    <mat-spinner *ngIf="!mockedUser" style="margin: 0 auto"></mat-spinner>
    <div *ngIf="mockedUser" style="width: 600px; margin: 20px auto; padding-bottom: 60px">
      <div style="display: flex; flex-direction: row; align-items: center; padding-bottom: 18px">
        <button mat-icon-button color="primary" routerLink="/home" aria-label="Go back to home page"
                style="position: relative; ">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 style="margin: 0">{{ mockedUser.name }}</h1>
      </div>

      <mat-card style="padding: 12px 0; margin-bottom: 30px">
        <mat-card-header style="display: flex; justify-content: space-between; margin: 15px 0 10px 0">
          <mat-card-title>Workout goal</mat-card-title>
          <button mat-raised-button (click)="changeWorkoutGoal()">Edit</button>
        </mat-card-header>
        <mat-card-content>
          <ul>
            <li style="padding-bottom: 6px">Your goal per week: <b
              style="padding-left: 6px">{{ mockedUser.workoutData?.goalPerWeek }}</b></li>
            <!-- TODO fix later with dynamic data-->
            <li style="padding-bottom: 6px">1 from 3 workouts done for this week</li>
            <!-- TODO fix later with dynamic data-->
            <li style="padding-bottom: 18px">Finish your workout today, to stay on track</li>
          </ul>
        </mat-card-content>
      </mat-card>

      <!-- TODO enable real dynamic calculation of user's workout progress -->
      <mat-card style="padding: 12px 0; margin-bottom: 30px">
        <mat-card-header style="padding-bottom: 9px">
          <mat-card-title>Workout progress</mat-card-title>
        </mat-card-header>
        <mat-card-content
          style="display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-evenly; align-items: center; align-content: stretch;">
          <div class="distribute-vertically">
            <span style="padding-bottom: 6px">25% for this week</span>
            <mat-progress-spinner
              style="background: #f4f4f4; border-radius: 60px"
              [color]="'accent'"
              [mode]="'determinate'"
              [value]="25">
            </mat-progress-spinner>
          </div>
          <div class="distribute-vertically">
            <span style="padding-bottom: 6px">50% for this month</span>
            <mat-progress-spinner
              style="background: #f4f4f4; border-radius: 60px"
              [color]="'primary'"
              [mode]="'determinate'"
              [value]="50"
            >
            </mat-progress-spinner>
          </div>
          <div class="distribute-vertically">
            <span style="padding-bottom: 6px">75% for last 3 months</span>
            <mat-progress-spinner
              style="background: #f4f4f4; border-radius: 60px"
              [color]="'warn'"
              [mode]="'determinate'"
              [value]="75">
            </mat-progress-spinner>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header style="display: flex; justify-content: space-between; margin: 15px 0 10px 0">
          <mat-card-title>Workouts</mat-card-title>
          <button mat-raised-button (click)="changeWorkoutGoal()">Add workout</button>
        </mat-card-header>
        <mat-card-content *ngIf="userIsLoaded">
          <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                        style="width: 500px; margin: 0 auto; height: 550px;"></mat-calendar>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class DetailUserComponent implements OnInit {
  mockedUser: User | undefined;
  selectedDate!: Date;
  userIsLoaded = false;

  constructor(private route: ActivatedRoute, private userService: UserService) {
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userService.fetchUser(params['id']).subscribe({
          next: (user: User) => {
            this.mockedUser = {
              ...user,
              workoutData: WORKOUT_DATA
            };
            if (user !== undefined) this.userIsLoaded = true;
          },
          error: (error) => {
            console.log('Error loading user' + error.errorMessage)
          }
        }
      )
    });
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    return calculateHighlightedUserWorkouts(date, this.mockedUser?.workoutData?.completedWorkouts);
  };

  changeWorkoutGoal() {

  }
}
