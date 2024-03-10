import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {IAddWorkoutDialogData} from "./user-workouts.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput, MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {ERROR_MESSAGE} from "../../shared/constants";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {
  MatDatepicker,
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-add-workout-dialog',
  template: `
    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()" autocomplete="off">
        <div [formGroup]="addWorkoutForm">

          <mat-form-field style="margin: 20px 0; display: block">
            <mat-label>Select me</mat-label>
            <mat-select formControlName="category">
              <mat-option value="strength">Strength</mat-option>
              <mat-option value="endurance">Endurance</mat-option>
              <mat-option value="mobility">Mobility</mat-option>
              <mat-option value="yoga">Yoga</mat-option>
              <mat-option value="others">Others</mat-option>
            </mat-select>
            <mat-hint align="end">Here's the dropdown arrow ^</mat-hint>
            <mat-error *ngIf="category.invalid">{{
                ERROR_MESSAGE
              }}
            </mat-error>
          </mat-form-field>

          <!-- TODO add "touchUi" to improve mobile responsiveness https://material.angular.io/components/datepicker/overview -->
          <mat-form-field style="margin: 20px 0; display: block; width: 100%">
            <mat-label>Choose a date</mat-label>
            <input matInput [matDatepicker]="datepicker" formControlName="date">
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="datepicker"></mat-datepicker-toggle>
            <mat-datepicker #datepicker>
              <mat-datepicker-actions>
                <button mat-button matDatepickerCancel>Cancel</button>
                <button mat-raised-button color="primary" matDatepickerApply>Apply</button>
              </mat-datepicker-actions>
            </mat-datepicker>
            <mat-error *ngIf="date.invalid">{{
                ERROR_MESSAGE
              }}
            </mat-error>
          </mat-form-field>

          <mat-form-field style="display: block">
            <mat-label>Enter your description</mat-label>
            <input
              matInput
              formControlName="description"
              placeholder="Optional..."
              name="description"
            />
          </mat-form-field>
        </div>

        <button
          type="submit"
          mat-raised-button
          color="primary"
          style="margin: 10px auto 30px auto;"
        >
          Add
        </button>
      </form>
    </mat-dialog-content>
  `,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogTitle, MatDialogContent, FormsModule, MatButton, MatError, MatFormField, MatIcon, MatIconButton, MatInput, MatLabel, MatSuffix, NgIf, ReactiveFormsModule, MatSelect, MatOption, MatDatepickerToggle, MatDatepicker, MatDatepickerActions, MatDatepickerInput, MatDatepickerCancel, MatDatepickerApply],
})
export class AddWorkoutDialogComponent {

  addWorkoutForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    date: new FormControl(new Date(), [Validators.required]),
    description: new FormControl(''),
  });
  protected readonly ERROR_MESSAGE = ERROR_MESSAGE;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IAddWorkoutDialogData,
              public dialogRef: MatDialogRef<AddWorkoutDialogComponent>,
              private userService: UserService) {
  }

  get category(): any {
    return this.addWorkoutForm.get('category');
  }

  get date(): any {
    return this.addWorkoutForm.get('date');
  }

  onSubmit() {
    const {user} = this.data;
    if (user && user.id && this.addWorkoutForm.value.date) {
      this.userService.addWorkout(user, this.addWorkoutForm.value.date)
        .subscribe({
          next: (user) => this.dialogRef.close(user),
          error: (error) => console.log(error.message)
        });
    }
  }
}
