export interface LoginUser {
  email: string;
  password: string;
}

export interface CreateUser extends LoginUser {
  name: string;
}

export interface User extends CreateUser {
  id: string;
  workoutData?: WorkoutData;
}

export interface WorkoutData {
  goalPerWeek?: number;
  completedWorkouts?: Date[];
}