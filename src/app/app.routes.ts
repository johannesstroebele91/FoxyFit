import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home.component";
import {LoginComponent} from "./components/login.component";
import {isUserLoggedInGuard} from "./services/auth-guard.service";
import {LandingComponent} from "./components/landing.component";

export const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [isUserLoggedInGuard]},
  {path: '**', redirectTo: '/home'},
];
