export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string | null | undefined;
  password: string | null | undefined;
  workoutData?: WorkoutData;
}

export interface WorkoutData {
  goalPerWeek?: number;
  completedWorkouts?: Date[];
}
