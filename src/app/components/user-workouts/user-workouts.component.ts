import { Component, inject } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { User } from '../../models';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCalendar,
  MatCalendarCellCssClasses,
  MatDatepicker,
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { calculateHighlightedUserWorkouts } from '../../shared/utils';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule, NgIf } from '@angular/common';
import { ERROR_MESSAGE } from '../../shared/constants';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  map,
  merge,
  switchMap,
  tap,
} from 'rxjs';

import {
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AddWorkoutDialogComponent } from './add-workout-dialog.component';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  MatOption,
  MatSelect,
  MatSelectModule,
} from '@angular/material/select';

export interface IAddWorkoutDialogData {
  user: User;
}

@Component({
  selector: 'app-user-workouts-user',
  standalone: true,
  imports: [
    CommonModule,
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
  styles: [
    `
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
    `,
  ],
  template: `
    @if (user$ | async; as user) {
    <div style="width: 600px; margin: 20px auto; padding-bottom: 60px">
      <div
        style="display: flex; flex-direction: row; align-items: center; padding-bottom: 18px"
      >
        <button
          mat-icon-button
          color="primary"
          routerLink="/home"
          aria-label="Go back to home page"
          style="position: relative; "
        >
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 style="margin: 0">{{ user.name }}</h1>
      </div>

      <mat-card style="padding: 12px 0; margin-bottom: 30px">
        <mat-card-header style="margin: 15px 0 10px 0">
          <mat-card-title>Workout goal</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field style="display: block; width: auto">
            <mat-form-field>
              <mat-label>Your weekly workout goal</mat-label>
              <input
                type="number"
                matInput
                placeholder="Insert goal"
                name="goalPerWeek"
                [formControl]="goalPerWeek"
                (input)="onGoalPerWeekChange($event)"
                step="1"
              />
              <mat-icon matSuffix>mode_edit</mat-icon>
              <mat-error *ngIf="goalPerWeek.invalid">{{
                ERROR_MESSAGE
              }}</mat-error>
            </mat-form-field>
          </mat-form-field>
          <!-- TODO fix later with dynamic data-->
          <p style="padding-bottom: 6px">
            1 from {{ user.workoutData.goalPerWeek }} workouts done for this
            week
          </p>
          <!-- TODO fix later with dynamic data-->
          <p style="padding-bottom: 18px">
            Finish your workout today, to stay on track
          </p>
        </mat-card-content>
      </mat-card>

      <!-- TODO enable real dynamic calculation of user's workout progress -->
      <mat-card style="padding: 12px 0; margin-bottom: 30px">
        <mat-card-header style="padding-bottom: 9px">
          <mat-card-title>Workout progress</mat-card-title>
        </mat-card-header>
        <mat-card-content
          style="display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-evenly; align-items: center; align-content: stretch;"
        >
          <div class="distribute-vertically">
            <span style="padding-bottom: 6px">25% for this week</span>
            <mat-progress-spinner
              style="background: #f4f4f4; border-radius: 60px"
              [color]="'accent'"
              [mode]="'determinate'"
              [value]="25"
            >
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
              [value]="75"
            >
            </mat-progress-spinner>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header
          style="display: flex; justify-content: space-between; margin: 15px 0 10px 0"
        >
          <mat-card-title>Workouts</mat-card-title>
          <button mat-raised-button (click)="openDialog()">Add workout</button>
        </mat-card-header>
        <mat-card-content>
          <mat-calendar
            [dateClass]="dateClass"
            style="width: 500px; margin: 0 auto; height: 550px;"
          ></mat-calendar>
        </mat-card-content>
      </mat-card>
    </div>
    } @else {
    <mat-spinner style="margin: 0 auto"></mat-spinner>}
  `,
})
export class UserWorkoutsComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  dialog = inject(MatDialog);

  userForDialog: User | undefined;
  goalPerWeek = new FormControl(1, Validators.required);
  protected readonly ERROR_MESSAGE = ERROR_MESSAGE;

  userViaDialogSubject$ = new Subject<User>();
  userViaUrl$: Observable<User> = this.route.queryParams.pipe(
    switchMap((params) => this.userService.fetchUser(params['id']))
  );

  user$: Observable<User> = merge(
    this.userViaUrl$,
    this.userViaDialogSubject$
  ).pipe(
    tap((user) => (this.userForDialog = user)), // Dialog needs access to user before async in template
    catchError((error) => {
      console.error('Error fetching user:', error);
      return EMPTY; // Prevents the Observable from completing on error
    })
  );

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    return calculateHighlightedUserWorkouts(
      date,
      this.userForDialog?.workoutData?.completedWorkouts
    );
  };

  /* THIS DID NOT WORK UNFORTUNATELY */
  // dateClass$: Observable<(date: Date) => MatCalendarCellCssClasses> =
  //   this.user$.pipe(
  //     map((user) => {
  //       return (date: Date): MatCalendarCellCssClasses => {
  //         return calculateHighlightedUserWorkouts(
  //           date,
  //           user?.workoutData?.completedWorkouts
  //         );
  //       };
  //     })
  //   );

  openDialog() {
    const dialogRef = this.dialog.open(AddWorkoutDialogComponent, {
      data: {
        user: this.userForDialog,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((user: User) => this.userViaDialogSubject$.next(user));
  }

  onGoalPerWeekChange(goalEvent: Event) {
    const goalPerWeek = (goalEvent?.target as HTMLInputElement).valueAsNumber; // Assuming input type is number
    if (goalPerWeek && this.userForDialog && this.userForDialog.id) {
      this.userService
        .updateUserGoalPerWeek(this.userForDialog.id, goalPerWeek)
        .subscribe({
          next: () => console.log('Goal per week updated successfully'),
          error: (error) => console.log(error.message),
        });
    }
  }
}
