import {inject, Injectable} from '@angular/core';
import {exhaustMap, map, Observable, take} from 'rxjs';
import { UserWithWorkoutData} from '../models';
import {HttpClient} from '@angular/common/http';
import {AuthService} from "./auth.service";

interface ResponseData {
  [key: string]: UserWithWorkoutData;
}

const DOMAIN =
  'https://foxy-fit-default-rtdb.europe-west1.firebasedatabase.app';
const USER_PATH = '/users';

@Injectable({
  providedIn: 'root', // This makes AuthService available throughout the application
})
export class UserService {
  authService = inject(AuthService);
  http = inject(HttpClient);

  createUser(user: UserWithWorkoutData): Observable<{ name: string }> {
    return this.http.put<{
      name: string;
    }>(`${DOMAIN}${USER_PATH}/${user.id}.json`, user);
  }

  fetchUsers(): Observable<UserWithWorkoutData[]> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(() => {
      return this.http.get<ResponseData>(DOMAIN + USER_PATH + '.json')
    }),
      map((responseData: ResponseData) => {
        const users: UserWithWorkoutData[] = [];
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
    )
  }

  fetchUser(id: string): Observable<UserWithWorkoutData> {
    return this.http.get<UserWithWorkoutData>(`${DOMAIN}${USER_PATH}/${id}.json`)
      .pipe(
        map((user: UserWithWorkoutData) => {
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

  addWorkout(user: UserWithWorkoutData, newWorkout: Date): Observable<any> {
    const completedWorkouts = user.workoutData.completedWorkouts || [];
    const userData: UserWithWorkoutData = {
      ...user,
      workoutData: {goalPerWeek: user.workoutData.goalPerWeek, completedWorkouts: [...completedWorkouts, newWorkout]}
    };
    return this.http.patch(`${DOMAIN}${USER_PATH}/${user.id}.json`, userData);
  }
}
