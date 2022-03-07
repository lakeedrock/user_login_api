export interface Registrable {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
}

export interface PasswordComparable {
  password: string;
  passwordConfirmation: string;
}

export interface Loginable {
  email: string;
  password: string;
}

export interface Updatable {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PasswordUpdatable {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}
