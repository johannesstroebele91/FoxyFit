import {HttpErrorResponse} from "@angular/common/http";

export function calculateHighlightedUserWorkouts(date: Date, workoutDates: Date[] | undefined) {
  if (!workoutDates || workoutDates.length === 0 || !date) {
    return '';
  }

  const highlightDate = workoutDates?.some((completedWorkoutAsDay: Date) => completedWorkoutAsDay.getDate() === date.getDate() && completedWorkoutAsDay.getMonth() === date.getMonth() && completedWorkoutAsDay.getFullYear() === date.getFullYear());

  return highlightDate ? 'workout-day' : '';
}

const defaultErrorMessageAdmin = 'Please write an email to an admin (stroebele.j@gmail.com).'

const SIGNUP_FIREBASE_AUTH_ERROR_MESSAGES: SignupErrorMessages = {
  'EMAIL_EXISTS': 'The email address is already in use by another account. Please, try another one.',
  'OPERATION_NOT_ALLOWED': 'Password sign-in is disabled for this project. ' + defaultErrorMessageAdmin,
  'TOO_MANY_ATTEMPTS_TRY_LATER': 'We have blocked all requests from this device due to an unusual activity (e.g. too many login attempts) ' + defaultErrorMessageAdmin
};

const LOGIN_FIREBASE_AUTH_ERROR_MESSAGES: SignupErrorMessages = {
  'EMAIL_NOT_FOUND': 'Email already exists. Try another one.',
  'INVALID_PASSWORD': 'The password is invalid or the user does not have a password. ' + defaultErrorMessageAdmin,
  'USER_DISABLED': 'The user account has been disabled by an administrator. ' + defaultErrorMessageAdmin
};

interface SignupErrorMessages {
  [key: string]: string;
}

export function createFirebaseAuthErrorMessage(error: HttpErrorResponse, type: 'signup' | 'login'): string {
  const errorCode = error.error.error.message;
  return type === 'signup' ? SIGNUP_FIREBASE_AUTH_ERROR_MESSAGES[errorCode] : type === 'login' ? LOGIN_FIREBASE_AUTH_ERROR_MESSAGES[errorCode] : errorCode;
}
