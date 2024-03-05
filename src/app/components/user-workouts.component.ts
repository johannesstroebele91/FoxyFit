import {Component, Input} from "@angular/core";
import {MatCalendar, MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-user-workouts',
  standalone: true,
  styles: [`
    ::ng-deep .mat-calendar-header {
      display: none;
    }

    .custom-card {
      width: 630px;
      margin: 10px 0;
    }

    ::ng-deep .workout-day {
      background-color: #a0e992 !important;
    }

    .row-flex {
      display: flex;
      flex-direction: row;
    }

    .mat-card-content {
      overflow-x: auto; /* Allow horizontal scrolling if content overflows */
    }
  `],
  imports: [
    MatCalendar,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle
  ],
  template: `
    <mat-card class="custom-card">
      <mat-card-header>
        <mat-card-title>Mikhail (3x pro Woche)</mat-card-title>
      </mat-card-header>
      <mat-card-content class="row-flex">
        <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
        <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
        <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
      </mat-card-content>
    </mat-card>`
})
export class UserWorkoutsComponent {
  @Input() workouts!: Date[];

  selectedDate!: Date;

  // TODO fix t hat also "date" argument is used here
  dateClass = (date: Date): MatCalendarCellCssClasses => {
    const highlightDate = this.workouts.some(date =>
      date.getDate() === date.getDate() &&
      date.getMonth() === date.getMonth() &&
      date.getFullYear() === date.getFullYear());

    return highlightDate ? 'workout-day' : '';
  };
}
