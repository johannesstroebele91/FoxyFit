import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home.component";
import {isUserLoggedInGuard} from "./services/auth-guard.service";
import {LandingComponent} from "./components/landing.component";
import {RegisterComponent} from "./components/register.component";
import {DetailUserComponent} from "./components/detail-user.component";

export const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'detail', component: DetailUserComponent, canActivate: [isUserLoggedInGuard]},
  {path: 'home', component: HomeComponent, canActivate: [isUserLoggedInGuard]},
  {path: '**', redirectTo: '/home'},
];
