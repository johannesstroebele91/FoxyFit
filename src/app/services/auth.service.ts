import {Injectable} from '@angular/core';
import {User} from "../models";
import {UserService} from "./user.service";

const FAKE_TOKEN = 'FAKE_TOKEN';


@Injectable({
  providedIn: 'root' // This makes AuthService available throughout the application
})
export class AuthService {

  // This would be replaced with actual token logic in a real app
  private token: string | null = null;

  constructor(private userService: UserService) {
  }


  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Check if the token is present and not expired
      resolve(this.token !== null);
    });
  }

  login(user: User): Promise<{
    loginAllowed: boolean,
    errorMessage?: string | null
  }> {
    const {email, password} = user;

    return new Promise((resolve, reject) => {
      // Simulate token authentication
      this.token = FAKE_TOKEN;

      // Fetch users
      this.userService.fetchUsers().subscribe({
        next: (users) => {
          // Check if any user matches the provided email and password
          const userInsertedValidCreds = users.some((loadedUser) => {
            return loadedUser.email === email && loadedUser.password === password;
          });

          if (userInsertedValidCreds && this.token === FAKE_TOKEN) {
            resolve({loginAllowed: true});
          } else {
            resolve({
              loginAllowed: false,
              errorMessage: 'Invalid email, password or token. Please try again or register a new user via the link below.'
            });
          }
        },
        error: (error) => {
          reject({loginAllowed: false, errorMessage: error.message});
        }
      });
    });
  }

  logout() {
    // Clear the token on logout
    this.token = null;
  }
}

