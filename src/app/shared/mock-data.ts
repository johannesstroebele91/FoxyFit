import {mockWorkoutDates} from "./utils";

export const WORKOUT_DATA = {
  goalPerWeek: Math.floor(Math.random() * 4) + 1,
  completedWorkouts: mockWorkoutDates()
}
