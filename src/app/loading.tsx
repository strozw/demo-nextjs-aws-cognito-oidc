export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">AWS Cognito Auth Sample</h1>
          <p className="mt-4 text-muted-foreground">Next.js 16 + React 19.2 + AWS Cognito</p>
        </div>

        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">読み込み中...</h2>
              <p className="mt-2 text-sm text-muted-foreground">しばらくお待ちください</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
