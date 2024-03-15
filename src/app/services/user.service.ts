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

  createUser(user: CreateUser): Observable<{ name: string }> {
    const userWithId = {...user, id: crypto.randomUUID()};
    return this.http.put<{
      name: string;
    }>(`${DOMAIN}${USER_PATH}/${userWithId.id}.json`, userWithId);
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<ResponseData>(DOMAIN + USER_PATH + '.json').pipe(
      map((responseData: ResponseData) => {
        const users: User[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            const user = responseData[key];
            const workoutData = responseData[key].workoutData;
            users.push({
              ...user,
              id: key,
              workoutData: {
                goalPerWeek: workoutData.goalPerWeek,
                completedWorkouts: workoutData.completedWorkouts?.length === 0 ? [] : workoutData.completedWorkouts?.map((dateString) => {
                  return new Date(dateString)
                })
              }
            });
          }
        }
        return users;
      })
    );
  }

  fetchUser(id: string): Observable<User> {
    return this.http.get<User>(`${DOMAIN}${USER_PATH}/${id}.json`)
      .pipe(
        map((user: User) => {
          return {
            ...user,
            workoutData: {
              goalPerWeek: user.workoutData.goalPerWeek,
              completedWorkouts: user.workoutData.completedWorkouts?.length === 0 ? [] : user.workoutData.completedWorkouts?.map((dateString) => {
                return new Date(dateString)
              })
            }
          };
        })
      );
  }

  updateUserGoalPerWeek(userId: string, goalPerWeek: number): Observable<any> {
    const userData = {workoutData: {goalPerWeek}};
    return this.http.patch(`${DOMAIN}${USER_PATH}/${userId}.json`, userData);
  }

  addWorkout(user: User, newWorkout: Date): Observable<any> {
    const completedWorkouts = user.workoutData.completedWorkouts || [];
    const userData: User = {
      ...user,
      workoutData: {goalPerWeek: user.workoutData.goalPerWeek, completedWorkouts: [...completedWorkouts, newWorkout]}
    };
    return this.http.patch(`${DOMAIN}${USER_PATH}/${user.id}.json`, userData);
  }
}
