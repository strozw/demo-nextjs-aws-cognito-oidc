import { NextResponse } from 'next/server';
import { generatePKCE, getAuthorizationUrl } from '@/lib/cognito';
import { getSession } from '@/lib/session';
import { randomBytes } from 'crypto';

export async function GET() {
  try {
    // PKCEパラメータを生成
    const { code_verifier, code_challenge } = await generatePKCE();
    const state = randomBytes(32).toString('hex');

    // セッションにPKCEパラメータを保存
    const session = await getSession();
    session.code_verifier = code_verifier;
    session.state = state;
    await session.save();

    // Cognito認証URLを生成
    const authUrl = await getAuthorizationUrl(code_challenge, state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to initiate login' }, { status: 500 });
  }
}
