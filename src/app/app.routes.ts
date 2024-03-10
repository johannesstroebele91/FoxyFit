import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {isUserLoggedInGuard} from "./services/auth-guard.service";
import {LandingComponent} from "./components/landing/landing.component";
import {RegisterComponent} from "./components/landing/register.component";
import {UserWorkoutsComponent} from "./components/user-workouts/user-workouts.component";

export const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent, canActivate: [isUserLoggedInGuard]},
  {path: 'user-workouts', component: UserWorkoutsComponent, canActivate: [isUserLoggedInGuard]},
  {path: '**', redirectTo: '/home'},
];
