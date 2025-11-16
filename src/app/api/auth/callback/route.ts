import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, parseIdToken } from '@/lib/cognito';
import { createSession, getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      return NextResponse.redirect(new URL('/?error=missing_parameters', request.url));
    }

    // セッションからPKCEパラメータを取得
    const session = await getSession();
    const codeVerifier = session.codeVerifier;
    const savedState = session.state;

    if (!codeVerifier || !savedState) {
      return NextResponse.redirect(new URL('/?error=invalid_session', request.url));
    }

    // stateを検証
    if (state !== savedState) {
      return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
    }

    // 認可コードをトークンに交換
    const tokens = await exchangeCodeForTokens(code, codeVerifier);

    if (!tokens.access_token || !tokens.id_token) {
      return NextResponse.redirect(new URL('/?error=invalid_tokens', request.url));
    }

    // IDトークンからユーザー情報を取得
    const userInfo = parseIdToken(tokens.id_token);

    if (!userInfo) {
      return NextResponse.redirect(new URL('/?error=invalid_user_info', request.url));
    }

    // セッションを作成
    await createSession({
      userId: userInfo.userId,
      email: userInfo.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiresIn: tokens.expires_in || 3600,
    });

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/?error=authentication_failed', request.url));
  }
}
