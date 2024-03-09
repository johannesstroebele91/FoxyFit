import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {CreateUser, User} from '../models';
import {HttpClient} from '@angular/common/http';

interface ResponseData {
  [key: string]: User;
}

const DOMAIN =
  'https://foxy-fit-default-rtdb.europe-west1.firebasedatabase.app';
const USER_PATH = '/users';

@Injectable({
  providedIn: 'root', // This makes AuthService available throughout the application
})
export class UserService {
  http = inject(HttpClient);

  createNewUser(user: CreateUser): Observable<{ name: string }> {
    return this.http.post<{
      name: string;
    }>(DOMAIN + USER_PATH + '.json', user);
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<ResponseData>(DOMAIN + USER_PATH + '.json').pipe(
      map((responseData: ResponseData) => {
        const users: User[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            users.push({...responseData[key], id: key});
          }
        }
        return users;
      })
    );
  }

  fetchUser(id: string): Observable<User> {
    return this.http.get<User>(`${DOMAIN}${USER_PATH}/${id}.json`);
  }

  updateUserGoalPerWeek(userId: string, goalPerWeek: number): Observable<any> {
    const userData = {workoutData: {goalPerWeek}};
    return this.http.patch(`${DOMAIN}${USER_PATH}/${userId}.json`, userData);
  }
}
