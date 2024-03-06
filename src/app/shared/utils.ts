export function calculateHighlightedUserWorkouts(date: Date, workoutDates: Date[] | undefined) {
  const highlightDate = workoutDates?.some(completedWorkoutAsDay =>
    completedWorkoutAsDay.getDate() === date.getDate() &&
    completedWorkoutAsDay.getMonth() === date.getMonth() &&
    completedWorkoutAsDay.getFullYear() === date.getFullYear());

  return highlightDate ? 'workout-day' : '';
}
