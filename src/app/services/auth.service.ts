import {Injectable} from '@angular/core';

const FAKEAUTHTOKEN = 'FAKEAUTHTOKEN';

@Injectable({
  providedIn: 'root' // This makes AuthService available throughout the application
})
export class AuthService {

  // This would be replaced with actual token logic in a real app
  private token: string | null = null;

  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Check if the token is present and not expired
      resolve(this.token !== null);
    });
  }

  login(email: string | null, password: string | null): Promise<boolean> {
    // Simulate an HTTP request to a backend for authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful login and token retrieval
        this.token = FAKEAUTHTOKEN;
        if (email === 'test@web.de' && password === '123' && this.token === FAKEAUTHTOKEN) {
          resolve(true);
        }
      }, 800);
    });
  }

  logout() {
    // Clear the token on logout
    this.token = null;
  }
}

