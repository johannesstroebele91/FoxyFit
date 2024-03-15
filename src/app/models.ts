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
