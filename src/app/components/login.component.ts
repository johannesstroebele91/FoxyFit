import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Component} from "@angular/core";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatIconButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelect,
    MatOption,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardModule,
  ], template: `
    <mat-card style="padding: 30px 12px">
      <mat-card-header style="display: block;">
        <mat-card-title style="margin: 0 auto; font-size: 36px; text-align: center; width: 100%;">Amara</mat-card-title>
        <mat-card-subtitle style="margin: 30px auto; font-size: 24px; text-align: center; width: 100%;">Login
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form (ngSubmit)="onSubmit()">
          <div [formGroup]="loginForm">
            <mat-form-field style="display: block">
              <mat-label>Enter your email</mat-label>
              <input matInput formControlName="email" placeholder="pat@example.com" name="email" autocomplete="email">
              <mat-error *ngIf="email.invalid">{{ getErrorMessage(email) }}</mat-error>
            </mat-form-field>

            <mat-form-field style="display: block">
              <mat-label>Enter your password</mat-label>
              <input matInput formControlName="password" [type]="hide ? 'password' : 'text'" name="password"
                     autocomplete="current-password">
              <button mat-icon-button matSuffix (click)="hide = !hide" [attr.aria-label]="'Hide password'"
                      [attr.aria-pressed]="hide">
                <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="password.invalid">{{ getErrorMessage(email) }}</mat-error>
            </mat-form-field>

          </div>

          <button type="submit" mat-raised-button color="primary" style="display: block; margin: 0 auto;">Login
          </button>
          <mat-error style="margin-top: 12px" *ngIf="formIsInvalid && formWasTouched">Form is invalid AND was
            touched
          </mat-error>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  standalone: true
})
export class LoginComponent {
  hide = true;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private router: Router, private authService: AuthService) {
  }

  get email(): any {
    return this.loginForm.get('email');
  }

  get password(): any {
    return this.loginForm.get('password');
  }

  get formIsInvalid() {
    return this.loginForm.invalid;
  }

  get formWasTouched() {
    return this.loginForm.touched;
  }

  onSubmit() {
    console.log(this.loginForm)
    if (this.email && this.password) {
      this.authService.login(this.email.value, this.password.value).then(response => {
        if (response) {
          this.router.navigate(['/home']).then(r => console.log('User logged in'))
        }
      })
    }
  }


  getErrorMessage(formControl: FormControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') && 'Not a valid email';
  }
}
