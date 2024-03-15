import {inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AuthResponseData, LoginUser} from '../models';
import {UserService} from './user.service';
import {HttpClient} from "@angular/common/http";

const SESSION_TOKEN = crypto.randomUUID();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userService = inject(UserService);

  constructor(private http: HttpClient) {
  }

  signup(user: LoginUser) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDNfKQ0K7vvccU6vkC3mafU1wPtn64UGvU', {
      email: user.email, password: user.password, returnSecureToken: true
    })
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  login(user: LoginUser) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDNfKQ0K7vvccU6vkC3mafU1wPtn64UGvU', {
      email: user.email, password: user.password, returnSecureToken: true
    })
  }

  // TODO delete later
  loginOld(user: LoginUser): Observable<{ loginAllowed: boolean; errorMessage?: string }> {
    const {email, password} = user;

    sessionStorage.setItem('token', SESSION_TOKEN); // Authentication simulation // TODO: Add real authentication

    return this.userService.fetchUsers().pipe(map((users) => {
      const userInsertedValidCreds = users.some((loadedUser) => loadedUser.email === email);
      if (userInsertedValidCreds && sessionStorage.getItem('token') === SESSION_TOKEN) {
        return {loginAllowed: true};
      } else {
        console.log('Error logging in');
        return {
          loginAllowed: false,
          errorMessage: 'Invalid email, password, or token. Please try again or register a new user via the link below.',
        };
      }
    }), catchError((error) => {
      console.log('Error logging in:', error);
      return of({loginAllowed: false, errorMessage: error.message});
    }));
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }
}
