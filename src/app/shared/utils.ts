export function calculateHighlightedUserWorkouts(
  date: Date,
  workoutDates: (Date | string)[] | undefined
) {
  if (!workoutDates || workoutDates.length === 0 || !date) {
    return '';
  }

  const highlightDate = workoutDates.some(
    (completedWorkoutAsDay: Date | string) => {
      // completedWorkoutAsDay is a Date object on initial load,
      // When adding workouts, however, it seems to be a string representation of a date (ISO format)
      // In that case we have to parse the string to a Date object
      const workoutDate =
        completedWorkoutAsDay instanceof Date
          ? completedWorkoutAsDay
          : new Date(completedWorkoutAsDay);

      console.log('workoutDate: ', workoutDate);

      return (
        workoutDate.getDate() === date.getDate() &&
        workoutDate.getMonth() === date.getMonth() &&
        workoutDate.getFullYear() === date.getFullYear()
      );
    }
  );

  return highlightDate ? 'workout-day' : '';
}
