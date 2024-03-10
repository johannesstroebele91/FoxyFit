import {inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {LoginUser} from '../models';
import {UserService} from './user.service';

const SESSION_TOKEN = crypto.randomUUID();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userService = inject(UserService);

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  login(
    user: LoginUser
  ): Observable<{ loginAllowed: boolean; errorMessage?: string }> {
    const {email, password} = user;

    sessionStorage.setItem('token', SESSION_TOKEN); // Authentication simulation // TODO: Add real authentication

    return this.userService.fetchUsers().pipe(
      map((users) => {
        const userInsertedValidCreds = users.some(
          (loadedUser) =>
            loadedUser.email === email && loadedUser.password === password
        );
        if (
          userInsertedValidCreds &&
          sessionStorage.getItem('token') === SESSION_TOKEN
        ) {
          return {loginAllowed: true};
        } else {
          console.log('Error logging in');
          return {
            loginAllowed: false,
            errorMessage:
              'Invalid email, password, or token. Please try again or register a new user via the link below.',
          };
        }
      }),
      catchError((error) => {
        console.log('Error logging in:', error);
        return of({loginAllowed: false, errorMessage: error.message});
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }
}
