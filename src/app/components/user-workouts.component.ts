import {Component, Input, OnInit} from "@angular/core";
import {MatCalendar, MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {User} from "../models";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {calculateHighlightedUserWorkouts} from "../shared/utils";


/**
 * TODO delete later when users can add workouts by themselves
 * Generates an array of random dates distributed across the current month,
 * the last month, and the month before the last month.
 * @returns An array of Date objects representing the randomly generated dates.
 */
function createDates(): Date[] {
  const today = new Date();
  const dates: Date[] = [];
  const months = [today.getMonth(), today.getMonth() - 1, today.getMonth() - 2];

  // Calculate the number of dates to generate for each month
  const datesPerMonth = [5, 5, 5];

  // Iterate through each month
  for (let i = 0; i < months.length; i++) {
    const year = today.getFullYear();
    const month = months[i];
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the month

    // Generate the specified number of dates for the current month
    for (let j = 0; j < datesPerMonth[i]; j++) {
      // Generate a random day within the month
      const randomDay = Math.floor(Math.random() * daysInMonth) + 1;

      // If it's the current month, ensure that the date is not later than today
      if (i === 0 && month === today.getMonth() && randomDay > today.getDate()) {
        continue;
      }

      dates.push(new Date(year, month, randomDay));
    }
  }

  return dates;
}


@Component({
  selector: 'app-user-workouts',
  standalone: true,
  styles: [`
    ::ng-deep .mat-calendar-header {
      display: none;
    }


    ::ng-deep .workout-day {
      background-color: #a0e992 !important;
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
        <button mat-raised-button (click)="navigateToDetailPage()">View</button>
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
      workoutData: {
        goalPerWeek: Math.floor(Math.random() * 4) + 1,
        completedWorkouts: createDates()
      }
    };
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    return calculateHighlightedUserWorkouts(date, this.mockedUser?.workoutData?.completedWorkouts);
  };

  navigateToDetailPage() {
    this.router.navigate(['/detail'])

  }
}
