import {Component, Input, OnInit} from "@angular/core";
import {MatCalendar, MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {User} from "../models";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {calculateHighlightedUserWorkouts} from "../shared/utils";
import {WORKOUT_DATA} from "../shared/mock-data";

@Component({
  selector: 'app-user-workouts',
  standalone: true,
  styles: [`
    ::ng-deep .mat-calendar-header {
      display: none;
    }

    ::ng-deep .workout-day {
      background-color: #b6eea7 !important;
      border-radius: 60px;
    }

    .row-flex {
      display: flex;
      flex-direction: row;
    }

    .mat-card-content {
      overflow-x: auto;
    }
  `],
  imports: [
    MatCalendar,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    RouterLink
  ],
  template: `
    <mat-card style=" width: 600px; margin: 20px auto">
      <mat-card-header style="display: flex; justify-content: space-between; margin: 15px 0 10px 0">
        <mat-card-title>{{ mockedUser?.name }} ({{ mockedUser?.workoutData?.goalPerWeek }}x per week)</mat-card-title>
        <button mat-raised-button (click)="navigateToDetailPage(mockedUser?.id)">View</button>
      </mat-card-header>
      <mat-card-content class="row-flex">
        <!-- Month Before Last Month -->
        <mat-calendar [startAt]="monthBeforeLast" [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
        <!-- Last Month -->
        <mat-calendar [startAt]="lastMonth" [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
        <!-- Current Month -->
        <mat-calendar [startAt]="today" [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
      </mat-card-content>
    </mat-card>`
})
export class UserWorkoutsComponent implements OnInit {
  @Input() user!: User;
  mockedUser: User | undefined;
  selectedDate!: Date;

  today = new Date();
  lastMonth = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1);
  monthBeforeLast = new Date(this.today.getFullYear(), this.today.getMonth() - 2, 1);

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    // TODO let users insert their workoutData later by themselves instead of populating it with mock data
    this.mockedUser = {
      ...this.user,
      workoutData: WORKOUT_DATA
    };
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    return calculateHighlightedUserWorkouts(date, this.mockedUser?.workoutData?.completedWorkouts);
  };

  navigateToDetailPage(id: string | undefined) {
    this.router.navigate(['/detail'], {queryParams: {id: id}});
  }
}
