# Claude Code プロンプト設定

## プロジェクトコンテキスト

開発を開始する前に、必ず `AGENTS.md` を読み込んでプロジェクトの概要と技術スタックを理解してください。

### 重要なファイル

- `AGENTS.md`: プロジェクト概要、技術スタック、開発ガイドライン
- `.env.local`: 環境変数(機密情報を含むため gitignore)
- `package.json`: 依存関係とスクリプト

### 開発時の原則

1. **型安全性**: TypeScript strict モードを遵守
2. **最新機能の活用**: Next.js v16、React v19.2 の機能を使用
3. **セキュリティ**: 認証・認可の実装に細心の注意を払う
4. **コミット規約**: Conventional Commits を厳守

### 認証実装の注意点

- Authorization Code Flow with PKCE を使用
- セッションは iron-session で暗号化
- 環境変数から機密情報を読み込む
- クライアントサイドに機密情報を露出させない
