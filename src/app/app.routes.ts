import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {AuthGuard} from "./services/auth-guard.service";
import {LandingComponent} from "./components/landing/landing.component";
import {RegistrationComponent} from "./components/landing/registration.component";
import {UserWorkoutsComponent} from "./components/user-workouts/user-workouts.component";

export const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'register', component: RegistrationComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'user-workouts', component: UserWorkoutsComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/home'},
];
