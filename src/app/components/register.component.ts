import {Component} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-register', standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <mat-card style="padding: 30px 12px; text-align: center; width: 500px; margin: 0 auto;">
      <mat-card-header style="display: block;">
        <mat-card-title style=" font-size: 36px">
          <button mat-icon-button color="primary" routerLink="" aria-label="Go back to login page">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <span>Registration</span>
        </mat-card-title>
        <mat-card-subtitle style="margin: 30px auto; font-size: 24px;">Sign up here to continue
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <form (ngSubmit)="onSubmit()" autocomplete="off">
          <div [formGroup]="signupForm">

            <mat-form-field style="display: block">
              <mat-label>Enter your nickname</mat-label>
              <input matInput formControlName="name" placeholder="John Doe" name="name">
              <mat-error *ngIf="name.invalid">{{ getErrorMessage(name) }}</mat-error>
            </mat-form-field>

            <mat-form-field style="display: block">
              <mat-label>Enter your email</mat-label>
              <input matInput formControlName="email" placeholder="pat@example.com" name="email" autocomplete="off">
              <mat-error *ngIf="email.invalid">{{ getErrorMessage(email) }}</mat-error>
            </mat-form-field>

            <mat-form-field style="display: block">
              <mat-label>Enter your password</mat-label>
              <input matInput formControlName="password" [type]="hide ? 'password' : 'text'" name="password"
                     autocomplete="new-password">
              <button mat-icon-button matSuffix (click)="hide = !hide" [attr.aria-label]="'Hide password'"
                      [attr.aria-pressed]="hide">
                <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="password.invalid">{{ getErrorMessage(password) }}</mat-error>
            </mat-form-field>
          </div>

          <button type="submit" mat-raised-button color="primary" style="margin: 10px auto 30px auto;">
            Register
          </button>
        </form>
      </mat-card-content>
      <mat-card-footer>
        <span style="margin-top: 20px">If you are already registered, you can log in <a routerLink="register">here!</a></span>
      </mat-card-footer>
    </mat-card>
  `
})
export class RegisterComponent {
  hide = true;
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });


  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private userService: UserService) {
  }

  get name(): any {
    return this.signupForm.get('name');
  }


  get email(): any {
    return this.signupForm.get('email');
  }

  get password(): any {
    return this.signupForm.get('password');
  }

  onSubmit() {
    if (this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password) {
      this.userService.createNewUser({
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      }).subscribe({
        next: (responseData: { name: string }) => {
          console.log('User was created with this ID: ' + responseData.name);

          this.authService.login({
            email: this.signupForm.value.email,
            password: this.signupForm.value.password
          }).subscribe({
            next: (response) => {
              if (response.loginAllowed) {
                this.router.navigate(['/home']);
              }
            },
            error: (error) => {
              console.error('Error logging in:', error);
            }
          });
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }

  getErrorMessage(formControl: FormControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') && 'Not a valid email';
  }
}
