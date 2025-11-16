import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
  isLoggedIn: boolean;
  code_verifier?: string;
  state?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'cognito-auth-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function createSession(data: {
  userId: string;
  email?: string;
  accessToken: string;
  refreshToken?: string;
  idToken: string;
  expiresIn: number;
}): Promise<void> {
  const session = await getSession();
  session.userId = data.userId;
  session.email = data.email;
  // session.accessToken = data.accessToken;
  // session.refreshToken = data.refreshToken;
  session.idToken = data.idToken;
  session.expiresAt = Date.now() + data.expiresIn * 1000;
  session.isLoggedIn = true;
  await session.save();
}

export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}
