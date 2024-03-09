export interface LoginUser {
  email: string;
  password: string;
}

export interface CreateUser extends LoginUser {
  name: string;
  workoutData: WorkoutData;
}

export interface User extends CreateUser {
  id: string;
}

export interface WorkoutData {
  goalPerWeek: number;
  completedWorkouts?: Date[];
}
