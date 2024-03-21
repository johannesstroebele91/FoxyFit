import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpParams, HttpRequest} from '@angular/common/http';
import {inject} from "@angular/core";
import {exhaustMap, Observable, take} from "rxjs";
import {AuthService} from "./auth.service";
import {UserNew} from "../models"; // Import the authService


export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService); // Inject the authService and specify its type

  // Check if the request is for login or signup
  if (req.url.includes('accounts:signInWithPassword') || req.url.includes('accounts:signUp')) {
    // If it is, bypass the interceptor and return the original request
    return next(req);
  }


  return authService.user.pipe(
    take(1),
    exhaustMap((user: UserNew) => { // Specify the type of user as UserNew
      // if there is no user, return the original request
      console.log('user')
      console.log(user)
      if (!user) return next(req);
      const modifiedReq = req.clone({
        params: new HttpParams().set('auth', user.token || '')
      });
      return next(modifiedReq);
    })
  );
}
