export function calculateHighlightedUserWorkouts(date: Date, workoutDates: Date[] | undefined) {
  if (!workoutDates || workoutDates.length === 0 || !date) {
    return '';
  }

  const highlightDate = workoutDates?.some((completedWorkoutAsDay: Date) =>
    completedWorkoutAsDay.getDate() === date.getDate() &&
    completedWorkoutAsDay.getMonth() === date.getMonth() &&
    completedWorkoutAsDay.getFullYear() === date.getFullYear());

  return highlightDate ? 'workout-day' : '';
}

