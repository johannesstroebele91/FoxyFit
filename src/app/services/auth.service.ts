import {Injectable} from '@angular/core';
import {ReplaySubject, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthResponseData, LoginUser, UserNew} from '../models';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new ReplaySubject<UserNew>();

  constructor(private http: HttpClient) {
  }

  signup(user: LoginUser) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDNfKQ0K7vvccU6vkC3mafU1wPtn64UGvU', {
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
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDNfKQ0K7vvccU6vkC3mafU1wPtn64UGvU', {
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

  }

  logout(): void {
    // TODO remove firebase token
  }
}
