# AWS Cognito 認証サンプルアプリケーション

Next.js 16 + React 19.2 + AWS Cognito を使用した認証サンプルアプリケーションです。

> **Note:** このプロジェクトのベースは [Claude Code](https://claude.com/claude-code) によって生成されました。

## 技術スタック

- **Next.js**: v16.0.3 (App Router + Cache Components)
- **React**: v19.2.0 (React Compiler 有効)
- **TypeScript**: v5.9.3
- **AWS Cognito**: Authorization Code Flow with PKCE
- **openid-client**: v6.8.1 - OpenID Connect クライアント
- **iron-session**: v8.0.4 - セッション管理
- **shadcn/ui**: UIコンポーネントライブラリ
- **Tailwind CSS**: v4.1.17 - スタイリング
- **ESLint**: v9.39.1 + Prettier v3.6.2 - コード品質・フォーマット

## 機能

- ✅ AWS Cognito による OAuth 2.0 認証（Authorization Code Flow with PKCE）
- ✅ セッション管理（iron-session）
- ✅ ログイン・ログアウト機能
- ✅ 保護されたページ（認証が必要なページ）
- ✅ レスポンシブデザイン
- ✅ TypeScript strict モード
- ✅ React Compiler による自動最適化
- ✅ Next.js Cache Components による高速レンダリング

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd test-cognito-next
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. AWS Cognito の設定

#### 3.1 Cognito User Pool の作成

1. AWS マネジメントコンソールにログイン
2. Cognito サービスに移動
3. 「ユーザープールを作成」をクリック
4. 以下の設定を行う:
   - サインインオプション: Email
   - パスワードポリシー: デフォルトまたはカスタム
   - MFA: オプション
   - ユーザープール名: 任意の名前

#### 3.2 アプリケーションクライアントの作成

1. 作成したユーザープールを選択
2. 「アプリケーションの統合」タブに移動
3. 「アプリケーションクライアントを作成」をクリック
4. 以下の設定を行う:
   - アプリケーションタイプ: 公開クライアント
   - アプリケーションクライアント名: 任意の名前
   - 認証フロー: Authorization code grant
   - コールバック URL: `http://localhost:3000/api/auth/callback`
   - サインアウト URL: `http://localhost:3000`
   - OAuth 2.0 許可タイプ: Authorization code grant
   - OpenID Connect スコープ: openid, email, profile

#### 3.3 ドメインの設定

1. 「アプリケーションの統合」タブで「ドメイン」セクションに移動
2. Cognito ドメインを作成（例: `your-app-name`）
3. 完全なドメイン名をメモ（例: `your-app-name.auth.ap-northeast-1.amazoncognito.com`）

### 4. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成:

```bash
cp .env.example .env.local
```

`.env.local` を編集して、AWS Cognito の情報を設定:

```env
# AWS Cognito Configuration
COGNITO_USER_POOL_URL=https://cognito-idp.your-region.amazonaws.com/your-user-pool-id
COGNITO_AUTH_URL=http://your-user-pool-id-sub-domain.auth.your-region.amazoncognito.com
COGNITO_CLIENT_ID=your-client-id-from-cognito
COGNITO_REDIRECT_URI=http://localhost:3000/api/auth/callback
COGNITO_LOGOUT_URI=http://localhost:3000

# Session Secret (32文字以上のランダムな文字列)
SESSION_SECRET=your-session-secret-at-least-32-characters-long

# Node Environment
NODE_ENV=development
```

SESSION_SECRET の生成方法:

```bash
openssl rand -base64 32
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## プロジェクト構造

```
.
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   └── auth/             # 認証関連のエンドポイント
│   │   │       ├── login/        # ログイン開始
│   │   │       ├── callback/     # 認証コールバック
│   │   │       └── logout/       # ログアウト
│   │   ├── dashboard/            # 保護されたページ
│   │   ├── layout.tsx            # ルートレイアウト
│   │   ├── page.tsx              # ホームページ
│   │   └── globals.css           # グローバルスタイル
│   ├── components/               # Reactコンポーネント
│   │   └── ui/                   # shadcn/ui コンポーネント
│   ├── lib/                      # ユーティリティ・設定
│   │   ├── cognito.ts            # Cognito認証ロジック
│   │   ├── session.ts            # セッション管理
│   │   └── utils.ts              # ユーティリティ関数
│   └── types/                    # TypeScript型定義
│       └── session.ts            # セッション関連の型
├── public/                       # 静的ファイル
├── .env.example                  # 環境変数のサンプル
├── .env.local                    # 環境変数（gitignore）
├── components.json               # shadcn/ui 設定
├── next.config.ts                # Next.js 設定
├── tailwind.config.ts            # Tailwind CSS 設定
├── tsconfig.json                 # TypeScript 設定
├── eslint.config.mjs             # ESLint 設定
├── .prettierrc                   # Prettier 設定
└── package.json
```

## 開発コマンド

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番環境での起動
npm start

# コードのリント
npm run lint

# コードのフォーマット
npm run format
```

## 認証フロー

### ログイン

1. ユーザーが「ログイン」ボタンをクリック
2. `/api/auth/login` にリクエスト
3. PKCE パラメータ（code_verifier, code_challenge）を生成
4. セッションに保存し、Cognito の認証エンドポイントにリダイレクト
5. ユーザーが Cognito のログイン画面で認証
6. `/api/auth/callback` にリダイレクト（認可コード付き）
7. 認可コードをトークンに交換
8. ユーザー情報を取得し、セッションに保存
9. ホームページにリダイレクト

### ログアウト

1. ユーザーが「ログアウト」ボタンをクリック
2. `/api/auth/logout` にリクエスト
3. セッションを削除
4. Cognito のログアウトエンドポイントにリダイレクト
5. ホームページにリダイレクト

## セキュリティ

- ✅ PKCE (Proof Key for Code Exchange) による認証フロー
- ✅ State パラメータによる CSRF 対策
- ✅ HTTPOnly Cookie によるセッション管理
- ✅ iron-session による暗号化されたセッション
- ✅ 環境変数による機密情報の管理
- ✅ TypeScript strict モードによる型安全性

## テストユーザーの作成

Cognito のユーザープールでテストユーザーを作成:

1. AWS マネジメントコンソールで Cognito に移動
2. 作成したユーザープールを選択
3. 「ユーザー」タブで「ユーザーを作成」をクリック
4. メールアドレスとパスワードを設定
5. 「ユーザーを作成」をクリック

## トラブルシューティング

### エラー: "missing_parameters"

- Cognito からのコールバックに `code` または `state` が含まれていません
- Cognito の設定でコールバック URL が正しく設定されているか確認してください

### エラー: "invalid_session"

- セッションに PKCE パラメータが保存されていません
- ログインフローを最初からやり直してください

### エラー: "invalid_state"

- State パラメータが一致しません（CSRF 攻撃の可能性）
- ログインフローを最初からやり直してください

### エラー: "authentication_failed"

- トークンの交換に失敗しました
- Cognito の設定（Client ID、ドメインなど）が正しいか確認してください
- コールバック URL が Cognito に登録されているか確認してください

## コミット規約

本プロジェクトでは **Conventional Commits** を採用しています。

### コミットメッセージの形式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type の種類

- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの動作に影響しない変更
- `refactor`: バグ修正や機能追加を伴わないコードの改善
- `perf`: パフォーマンス向上のための変更
- `test`: テストの追加や修正
- `chore`: ビルドプロセスやツールの変更

詳細は [AGENTS.md](./AGENTS.md) を参照してください。

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [openid-client Documentation](https://github.com/panva/openid-client)
- [iron-session Documentation](https://github.com/vvo/iron-session)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ライセンス

MIT
