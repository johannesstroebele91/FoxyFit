export function calculateHighlightedUserWorkouts(date: Date, workoutDates: Date[] | undefined) {
  if (!workoutDates) {
    return '';
  }

  const highlightDate = workoutDates?.some(completedWorkoutAsDay =>
    completedWorkoutAsDay.getDate() === date.getDate() &&
    completedWorkoutAsDay.getMonth() === date.getMonth() &&
    completedWorkoutAsDay.getFullYear() === date.getFullYear());

  return highlightDate ? 'workout-day' : '';
}

/**
 * TODO delete later when users can add workouts by themselves
 * Generates an array of random dates distributed across the current month,
 * the last month, and the month before the last month.
 * @returns An array of Date objects representing the randomly generated dates.
 */
export function mockWorkoutDates(): Date[] {
  const today = new Date();
  const dates: Date[] = [];
  const months = [today.getMonth(), today.getMonth() - 1, today.getMonth() - 2];

  // Calculate the number of dates to generate for each month
  const datesPerMonth = [5, 5, 5];

  // Iterate through each month
  for (let i = 0; i < months.length; i++) {
    const year = today.getFullYear();
    const month = months[i];
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the month

    // Generate the specified number of dates for the current month
    for (let j = 0; j < datesPerMonth[i]; j++) {
      // Generate a random day within the month
      const randomDay = Math.floor(Math.random() * daysInMonth) + 1;

      // If it's the current month, ensure that the date is not later than today
      if (i === 0 && month === today.getMonth() && randomDay > today.getDate()) {
        continue;
      }

      dates.push(new Date(year, month, randomDay));
    }
  }

  return dates;
}
