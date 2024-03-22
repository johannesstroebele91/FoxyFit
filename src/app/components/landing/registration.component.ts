import {Component, inject} from "@angular/core";
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
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {ERROR_MESSAGE} from "../../shared/constants";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {UsersWorkoutsComponent} from "../home/users-workouts.component";

@Component({
  selector: 'app-register',
  standalone: true,
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
    AsyncPipe,
    MatProgressSpinner,
    NgForOf,
    UsersWorkoutsComponent,
  ],
  template: `
    @if (isLoading) {
      <mat-card
        style="padding: 30px 12px; text-align: center; width: 500px; margin: 0 auto;"
      >
        <mat-card-header style="display: block;">
          <mat-card-title style=" font-size: 36px">
            <button
              mat-icon-button
              color="primary"
              routerLink=""
              aria-label="Go back to login page"
            >
              <mat-icon>arrow_back</mat-icon>
            </button>
            <span>Registration</span>
          </mat-card-title>
          <mat-card-subtitle style="margin: 30px auto; font-size: 24px;"
          >Sign up here to continue
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="onSubmit()" autocomplete="off">
            <div [formGroup]="signupForm">
              <mat-form-field style="display: block">
                <mat-label>Enter your nickname</mat-label>
                <input
                  matInput
                  formControlName="name"
                  placeholder="John Doe"
                  name="name"
                />
                <mat-error *ngIf="name.invalid">{{
                    ERROR_MESSAGE
                  }}
                </mat-error>
              </mat-form-field>

              <mat-form-field style="display: block">
                <mat-label>Enter your email</mat-label>
                <input
                  matInput
                  formControlName="email"
                  placeholder="pat@example.com"
                  name="email"
                  autocomplete="off"
                />
                <mat-error *ngIf="email.invalid">{{
                    ERROR_MESSAGE
                  }}
                </mat-error>
              </mat-form-field>

              <mat-form-field style="display: block">
                <mat-label>Enter your password</mat-label>
                <input
                  matInput
                  formControlName="password"
                  [type]="hidePasswordInput ? 'password' : 'text'"
                  name="password"
                  autocomplete="new-password"
                  minlength="6"
                />
                <button
                  type="button"
                  mat-icon-button
                  matSuffix
                  (click)="hidePasswordInput = !hidePasswordInput"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePasswordInput"
                >
                  <mat-icon>{{
                      hidePasswordInput ? 'visibility_off' : 'visibility'
                    }}
                  </mat-icon>
                </button>
                <mat-error *ngIf="password.invalid">{{
                    ERROR_MESSAGE
                  }}
                </mat-error>
              </mat-form-field>
            </div>

            <button
              type="submit"
              mat-raised-button
              color="primary"
              style="margin: 10px auto 20px auto;"
            >
              Register
            </button>
            <mat-error *ngIf="signupErrorMessage" style="margin-bottom: 10px">{{
                signupErrorMessage
              }}
            </mat-error>
          </form>
        </mat-card-content>
        <mat-card-footer>
        <span style="margin-top: 20px"
        >If you are already registered, you can log in
          <a routerLink="">here!</a></span
        >
        </mat-card-footer>
      </mat-card>
    } @else {
      <mat-spinner style="margin: 0 auto"></mat-spinner>
    }
  `,
})
export class RegistrationComponent {
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);

  hidePasswordInput = true;
  isLoading = true;
  signupErrorMessage: string | null = null;
  protected readonly ERROR_MESSAGE = ERROR_MESSAGE;

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

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
    const name = this.signupForm.value.name;
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    if (
      this.signupForm.status === "VALID" &&
      name &&
      email &&
      password
    ) {
      this.authService
        .signup({
          email: email!,
          password: password!,
        })
        .subscribe({
          next: () => {
            this.userService
              .createUser({
                name,
                email,
                id: crypto.randomUUID(),
                workoutData: {goalPerWeek: 1}
              })
              .subscribe({
                error: (error) => {
                  console.error('Error creating local user:', error);
                },

              })
          },
          error: (error: string) => {
            // TODO use error message later to display problem to user in template!
            console.log(error)
          },
          complete: () => {
            this.router.navigate(['/home']);
            this.isLoading = false;
          }
        })
    }
  }
}
