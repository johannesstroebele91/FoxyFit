export interface User {
  id?: string,
  name?: string,
  email: string,
  password: string,
  workoutData?: WorkoutData
}

export interface WorkoutData {
  goalPerWeek: number
  completedWorkouts: Date[]
}
