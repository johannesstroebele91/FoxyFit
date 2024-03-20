import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {UserNew} from "../models";
import {map} from "rxjs/operators";

export const AuthGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for the isAuthenticated promise to resolve
  const authenticated = authService.user.pipe(map((user: UserNew) => {
    return user !== null;
  }));

  return authenticated || (await router.navigate(['/']));
};
