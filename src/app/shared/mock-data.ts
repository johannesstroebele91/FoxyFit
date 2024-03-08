import {mockWorkoutDates} from "./utils";

export const WORKOUT_DATA = {
  goalPerWeek: Math.floor(Math.random() * 4) + 1,
  completedWorkouts: mockWorkoutDates()
}

export const ERROR_MESSAGE = 'You must enter a valid value';
