export interface LoginUser {
  email: string;
  password: string;
}

export interface CreateUser  {
  name: string;
  email: string;
  workoutData: WorkoutData;
}

export interface User extends CreateUser {
  id: string;
}

export interface WorkoutData {
  goalPerWeek: number;
  completedWorkouts?: Date[];
}

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export class UserNew {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date) {}


  get token(){
    if (!this._tokenExpirationDate || new Date() >this._tokenExpirationDate) return null
    return this._token
  }

}
