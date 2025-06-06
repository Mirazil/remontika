export function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
      return 'Неправильний логін або пароль';
    case 'auth/user-not-found':
      return 'Користувача не знайдено';
    case 'auth/email-already-in-use':
      return 'Email вже використовується';
    case 'auth/invalid-email':
      return 'Некоректний email';
    case 'auth/weak-password':
      return 'Пароль повинен містити щонайменше 6 символів';
    default:
      return 'Сталася помилка. Спробуйте ще раз.';
  }
}