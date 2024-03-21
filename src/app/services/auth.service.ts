import {inject, Injectable} from '@angular/core';
import {ReplaySubject, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthResponseData, LoginUser, UserNew} from '../models';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

const WEB_API_KEY = 'AIzaSyDNfKQ0K7vvccU6vkC3mafU1wPtn64UGvU'
const IDENTITY_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const URL_KEY = '?key='
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new ReplaySubject<UserNew | null>();

  http = inject(HttpClient);
  router = inject(Router);

  signup(user: LoginUser) {
    return this.http.post<AuthResponseData>(IDENTITY_URL + 'signUp' + URL_KEY +WEB_API_KEY, {
      email: user.email, password: user.password, returnSecureToken: true
    }).pipe(catchError(this.handleError), tap((resData) => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn);
    }))
  }


  login(user: LoginUser) {
    return this.http.post<AuthResponseData>(IDENTITY_URL +'signInWithPassword' +URL_KEY +WEB_API_KEY, {
      email: user.email, password: user.password, returnSecureToken: true
    }).pipe(catchError(this.handleError), tap((resData) => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn);
    }))
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMessage); // For network errors ("errorRes.error.error.message" might not exist)
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email was not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password is invalid';
        break;
      case 'USER_DISABLED':
        errorMessage = 'User is disabled';
        break;
    }
    return throwError(() =>errorMessage);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn *1000);
    const user = new UserNew(email, userId, token, expirationDate)
    this.user.next(user)
    localStorage.setItem('userData', JSON.stringify(user)); // JSON.stringify is needed because local store can only store strings for the key-value-pairs
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate(['/'])
  }

  autoLoginAfterReload() {
    const userDataJson = localStorage.getItem('userData');
    if (!userDataJson) return;

    const userData: {
      email: string,
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(userDataJson); // Now it's safe to parse because we checked for null

    const { email, id, _token, _tokenExpirationDate } = userData;

    const loadedUser = new UserNew(email, id, _token, new Date(_tokenExpirationDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }
}
