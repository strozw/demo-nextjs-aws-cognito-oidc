import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';
import { getLogoutUrl } from '@/lib/cognito';

export async function GET() {
  try {
    // セッションを削除
    await destroySession();

    // Cognitoのログアウトエンドポイントにリダイレクト
    const logoutUrl = getLogoutUrl();

    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
