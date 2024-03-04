import {Component} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatCalendar, MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {MatToolbar} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home', standalone: true, styles: [`
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
    </mat-card>

    <mat-card class="custom-card">
      <mat-card-header>
        <mat-card-title>Johannes (2x pro Woche)</mat-card-title>
      </mat-card-header>
      <mat-card-content class="row-flex">
        <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
        <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
        <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
      </mat-card-content>
    </mat-card>

    <mat-card class="custom-card">
      <mat-card-header>
        <mat-card-title>Ingo (1x pro Woche)</mat-card-title>
      </mat-card-header>
      <mat-card-content class="row-flex">
        <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
        <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
        <mat-calendar [selected]="selectedDate" [dateClass]="dateClass"
                      style="width: 200px; margin: 0 10px;"></mat-calendar>
      </mat-card-content>
    </mat-card>
  `,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCalendar,
    MatCardContent,
    MatToolbar,
    NgIf,
    RouterLink
  ]
})
export class HomeComponent {
  selectedDate!: Date;

  // TODO enable to add new workout dates via click
  workoutDays: Date[] = [
    new Date(2024, 2, 5), // Example dates when workouts were logged
    new Date(2024, 2, 12),
    // Add more dates as needed
  ];

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    const highlightDate = this.workoutDays.some(d =>
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear());

    return highlightDate ? 'workout-day' : '';
  };
}
