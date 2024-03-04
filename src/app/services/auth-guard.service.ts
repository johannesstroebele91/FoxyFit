import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

export const isUserLoggedInGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for the isAuthenticated promise to resolve
  const authenticated = await authService.isAuthenticated();

  if (authenticated) {
    return true;
  } else {
    await router.navigate(['/']);
    return false;
  }
};
