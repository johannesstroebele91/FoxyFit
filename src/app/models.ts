export interface User {
  id?: string,
  name?: string,
  email: string | null | undefined,
  password: string | null | undefined,
  workoutData?: WorkoutData
}

export interface WorkoutData {
  goalPerWeek?: number
  completedWorkouts?: Date[]
}
