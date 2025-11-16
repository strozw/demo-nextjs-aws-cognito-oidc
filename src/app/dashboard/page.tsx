import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">ダッシュボード</h1>
          <form action="/api/auth/logout" method="GET">
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold">ユーザー情報</h2>
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">ユーザーID:</span> {session.userId}
              </p>
              {session.email && (
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {session.email}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold">保護されたコンテンツ</h2>
            <p className="mt-4 text-muted-foreground">
              このページはログインしたユーザーのみアクセスできます。
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
