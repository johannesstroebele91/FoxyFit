import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
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
    RouterLink,
  ], template: `
    <div style="margin: 0 auto; max-width: 400px; text-align: center">
      <h1>Welcome!</h1>
      <p>Share your achievements, find workout partners, and get inspired. Together, we'll reach
        our goals and celebrate personal successes!</p>
      <button mat-raised-button color="primary" routerLink="login" style="width: 400px; margin-bottom: 10px">Anmelden
      </button>
      <button mat-raised-button color="accent" routerLink="register" style="width: 400px">Registrieren</button>
    </div>

  `,
  standalone: true
})
export class LandingComponent {
}
