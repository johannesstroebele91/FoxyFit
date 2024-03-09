import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {User} from "../models";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCalendar,
  MatCalendarCellCssClasses,
  MatDatepicker,
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {calculateHighlightedUserWorkouts} from "../shared/utils";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {UserService} from "../services/user.service";
import {NgIf} from "@angular/common";
import {COMPLETED_WORKOUTS_MOCKED, ERROR_MESSAGE} from "../shared/mock-data";
import {Subscription} from "rxjs";

import {MatDialog, MatDialogContent, MatDialogTitle,} from '@angular/material/dialog';
import {AddWorkoutDialog} from "./add-workout-dialog";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}


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
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogTitle,
    MatDialogContent,
    MatError,
    MatLabel,
    MatSuffix,
    MatSelect,
    MatOption,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerActions,
    MatDatepickerInput,
    MatDatepickerCancel,
    MatDatepickerApply,
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
        <mat-card-header style="margin: 15px 0 10px 0">
          <mat-card-title>Workout goal</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field style="display: block; width: auto">
            <mat-form-field>
              <mat-label>Your weekly workout goal</mat-label>
              <input type="number" matInput placeholder="Insert goal" name="goalPerWeek"
                     [formControl]="goalPerWeek" (input)="onGoalPerWeekChange($event)" step="1">
              <mat-icon matSuffix>mode_edit</mat-icon>
              <mat-error *ngIf="goalPerWeek.invalid">{{ ERROR_MESSAGE }}</mat-error>
            </mat-form-field>
          </mat-form-field>
          <!-- TODO fix later with dynamic data-->
          <p style="padding-bottom: 6px">1 from {{ mockedUser.workoutData.goalPerWeek }} workouts done for this
            week
          </p>
          <!-- TODO fix later with dynamic data-->
          <p style="padding-bottom: 18px">Finish your workout today, to stay on track</p>
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
          <button mat-raised-button (click)="openDialog()">Add workout</button>
        </mat-card-header>
        <mat-card-content *ngIf="userIsLoaded">
          <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                        style="width: 500px; margin: 0 auto; height: 550px;"></mat-calendar>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class DetailUserComponent implements OnInit, OnDestroy {
  mockedUser: User | undefined;
  selectedDate!: Date;
  userIsLoaded = false;
  goalPerWeek = new FormControl(1, Validators.required);
  protected readonly ERROR_MESSAGE = ERROR_MESSAGE;
  private userFetchSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private userService: UserService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userFetchSubscription = this.userService.fetchUser(params['id']).subscribe({
          next: (user: User) => {

            this.mockedUser = {
              ...user,
              id: params['id'],
              workoutData: {goalPerWeek: user.workoutData.goalPerWeek, completedWorkouts: COMPLETED_WORKOUTS_MOCKED}
            };
            if (user) this.userIsLoaded = true;
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

  openDialog() {
    const dialogRef = this.dialog.open(AddWorkoutDialog, {
      data: {
        animal: 'panda',
      },
    });
    // TODO delete maybe later if not needed
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy(): void {
    this.userFetchSubscription?.unsubscribe()
  }


  onGoalPerWeekChange(goalEvent: Event) {
    const goalPerWeek = (goalEvent?.target as HTMLInputElement).valueAsNumber; // Assuming input type is number

    console.log('goalPerWeek')
    console.log(goalPerWeek)
    console.log('this.mockedUser')
    console.log(this.mockedUser)
    console.log('this.mockedUser?.id')
    console.log(this.mockedUser?.id)
    if (goalPerWeek && this.mockedUser && this.mockedUser.id) {
      this.userService.updateUserGoalPerWeek(this.mockedUser.id, goalPerWeek)
        .subscribe({
          next: () => console.log('Goal per week updated successfully'),
          error: (error) => console.log(error.message)
        });
    }
  }
}
