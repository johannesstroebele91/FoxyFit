import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {User} from '../models';
import {UserService} from './user.service';

const FAKE_TOKEN = 'FAKE_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(private userService: UserService) {
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  login(user: User): Observable<{ loginAllowed: boolean; errorMessage?: string }> {
    const {email, password} = user;

    // Simulate token authentication
    this.token = FAKE_TOKEN;

    return this.userService.fetchUsers().pipe(
      map(users => {
        const userInsertedValidCreds = users.some(loadedUser => loadedUser.email === email && loadedUser.password === password);
        if (userInsertedValidCreds && this.token === FAKE_TOKEN) {
          return {loginAllowed: true};
        } else {
          console.log('Error logging in');
          return {
            loginAllowed: false,
            errorMessage: 'Invalid email, password, or token. Please try again or register a new user via the link below.'
          };
        }
      }),
      catchError(error => {
        console.log('Error logging in:', error);
        return of({loginAllowed: false, errorMessage: error.message});
      })
    );
  }

  logout(): void {
    // Clear the token on logout
    this.token = null;
  }
}
