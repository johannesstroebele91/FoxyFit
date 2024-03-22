export interface AuthLoginUser {
  email: string;
  password: string;
}

export class AuthUser {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date) {}


  get token(): null |string {
    if (!this._tokenExpirationDate || new Date() >this._tokenExpirationDate) return null
    return this._token
  }
}

export interface UserWithWorkoutData {
  name: string;
  email: string;
  id: string;
  workoutData: WorkoutData;
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
