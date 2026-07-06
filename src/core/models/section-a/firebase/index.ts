/**
 * @fileoverview TypeScript interfaces for a Firebase-like user authentication object.
 * This file models the structure of a user object returned after a sign-in operation.
 */

/**
 * Represents the token manager for the user's session.
 */
export interface StsTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number; // A Unix timestamp in milliseconds
}

/**
 * Represents a single provider linked to the user's account.
 */
export interface ProviderData {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

/**
 * Represents the main user object with all its properties.
 */
export interface User {
  _redirectEventId: string | null;
  apiKey: string;
  appName: string;
  createdAt: string;
  displayName: string | null;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  lastLoginAt: string;
  phoneNumber: string | null;
  photoURL: string | null;
  providerData: ProviderData[];
  stsTokenManager: StsTokenManager;
  tenantId: string | null;
  uid: string;
}

/**
 * Represents additional user information, typically from a third-party provider.
 */
export interface AdditionalUserInfo {
  isNewUser: boolean;
  profile: object; // The structure of this object can vary based on the provider
  providerId: string;
}

/**
 * The root interface for the entire authentication response object.
 */
export interface UserAuthResponse {
  additionalUserInfo: AdditionalUserInfo;
  credential: object | null; // The credential object can be null for password-based sign-ins
  operationType: 'signIn' | 'signUp' | 'link';
  user: User;
}