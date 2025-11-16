import Link from 'next/link';
import { getSession } from '@/lib/session';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">AWS Cognito Auth Sample</h1>
          <p className="mt-4 text-muted-foreground">Next.js 16 + React 19.2 + AWS Cognito</p>
        </div>

        <div className="rounded-lg border bg-card p-8 shadow-sm">
          {session.isLoggedIn ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">ようこそ!</h2>
                <p className="mt-2 text-sm text-muted-foreground">ログイン済みです</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">ユーザーID:</span> {session.userId}
                </p>
                {session.email && (
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {session.email}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  ダッシュボードへ
                </Link>
                <form action="/api/auth/logout" method="GET">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    ログアウト
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">ログインしてください</h2>
                <p className="mt-2 text-sm text-muted-foreground">AWS Cognito で認証を行います</p>
              </div>
              <form action="/api/auth/login" method="GET">
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  ログイン
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
