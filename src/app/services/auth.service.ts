import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models";
import {map, Observable} from "rxjs";

const fakeToken = 'fakeToken';

interface ResponseData {
  [key: string]: User;
}


@Injectable({
  providedIn: 'root' // This makes AuthService available throughout the application
})
export class AuthService {

  // This would be replaced with actual token logic in a real app
  private token: string | null = null;
  private loadedUsers: User[] | undefined;

  constructor(private http: HttpClient) {
  }


  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Check if the token is present and not expired
      resolve(this.token !== null);
    });
  }

  login(email: string | null, password: string | null): Promise<boolean> {
    // Use a fake token for now
    this.token = fakeToken;

    return new Promise((resolve, reject) => {
      this.fetchPosts().subscribe((users) => {
        this.loadedUsers = users;
        console.log(this.loadedUsers);
        const userInsertedValidCreds = this.loadedUsers.some((user) => {
          return user.email === email && user.password === password
        });

        if (userInsertedValidCreds && this.token === fakeToken) {
          resolve(true);
        }
      });
    });
  }

  logout() {
    // Clear the token on logout
    this.token = null;
  }

  private fetchPosts(): Observable<User[]> {
    return this.http.get<ResponseData>('https://foxy-fit-default-rtdb.europe-west1.firebasedatabase.app//users.json').pipe(
      map((responseData: ResponseData) => {
          const users: User[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              users.push({...responseData[key], id: key});
            }
          }
          return users;
        }
      )
    )
  }
}

