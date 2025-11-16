import * as client from 'openid-client';

// 環境変数の取得
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

// Cognito の設定を遅延初期化
async function getConfig() {
  const COGNITO_USER_POOL_URL = getEnvVar('COGNITO_USER_POOL_URL');
  const COGNITO_CLIENT_ID = getEnvVar('COGNITO_CLIENT_ID');
  const COGNITO_CLIENT_SECRET = getEnvVar('COGNITO_CLIENT_SECRET');

  return client.discovery(
    new URL(`${COGNITO_USER_POOL_URL}`),
    COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET
  );
}

// PKCE用のコードベリファイアとチャレンジを生成
export async function generatePKCE() {
  const code_verifier = client.randomPKCECodeVerifier();
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
  return { code_verifier, code_challenge };
}

// 認可URLを生成
export async function getAuthorizationUrl(code_challenge: string, state: string): Promise<string> {
  const COGNITO_REDIRECT_URI = getEnvVar('COGNITO_REDIRECT_URI');
  const discoveredConfig = await getConfig();
  const authorizationUrl = client.buildAuthorizationUrl(discoveredConfig, {
    redirect_uri: COGNITO_REDIRECT_URI,
    scope: 'openid email profile',
    code_challenge,
    code_challenge_method: 'S256',
    state,
  });

  return authorizationUrl.href;
}

// 認可コードをトークンに交換
export async function exchangeCodeForTokens(code: string, code_verifier: string) {
  const COGNITO_REDIRECT_URI = getEnvVar('COGNITO_REDIRECT_URI');
  const discoveredConfig = await getConfig();
  const currentUrl = new URL(COGNITO_REDIRECT_URI);
  currentUrl.searchParams.set('code', code);

  const tokens = await client.authorizationCodeGrant(discoveredConfig, currentUrl, {
    pkceCodeVerifier: code_verifier,
  });

  return tokens;
}

// IDトークンからユーザー情報を取得
export function parseIdToken(idToken: string) {
  try {
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString()) as Record<
      string,
      unknown
    >;
    return {
      userId: String(payload.sub || ''),
      email: payload.email ? String(payload.email) : undefined,
      emailVerified: Boolean(payload.email_verified),
    };
  } catch (error) {
    console.error('Failed to parse ID token:', error);
    return null;
  }
}

// ログアウトURLを生成
export function getLogoutUrl(): string {
  const COGNITO_DOMAIN = getEnvVar('COGNITO_DOMAIN');
  const COGNITO_CLIENT_ID = getEnvVar('COGNITO_CLIENT_ID');
  const COGNITO_LOGOUT_URI = getEnvVar('COGNITO_LOGOUT_URI');

  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    logout_uri: COGNITO_LOGOUT_URI,
  });

  return `https://${COGNITO_DOMAIN}/logout?${params.toString()}`;
}
