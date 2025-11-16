export interface SessionData {
  userId?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
  isLoggedIn: boolean;
}

export interface PKCEData {
  code_verifier: string;
  code_challenge: string;
  state: string;
}
