// Ported from mobile core/utils/utilities/validation.ts.

// Basic email check
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// >= 8 chars, at least 1 uppercase, 1 number, 1 special
export const PASSWORD_RE =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const isValidEmail = (email: string) =>
  EMAIL_RE.test(email.trim().toLowerCase());

export const isStrongPassword = (password: string) =>
  PASSWORD_RE.test(password);
