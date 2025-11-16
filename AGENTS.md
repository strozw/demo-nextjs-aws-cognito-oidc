# AGENTS.md

## プロジェクト概要

本プロジェクトは、AWS Cognito の Application Client を利用した認証機能を持つアプリケーションのサンプル実装です。

## 技術スタック

### Core Technologies

- **TypeScript**: v5.9.3
- **Node.js**: v22 (LTS)
- **Next.js**: v16.0.3 (App Router + Cache Components)
- **React**: v19.2.0
- **React Compiler**: v1.0.0 (有効)

### 認証・セッション管理

- **openid-client**: v6.8.1 - OpenID Connect クライアント実装
- **iron-session**: v8.0.4 - セッション管理

### UI・スタイリング

- **shadcn/ui**: UIコンポーネントライブラリ
- **Tailwind CSS**: v4.1.17

### コード品質・フォーマット

- **ESLint**: v9.39.1 - コード品質チェック
- **Prettier**: v3.6.2 - コードフォーマッター

## Git コミット規約

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
- `style`: コードの動作に影響しない変更(空白、フォーマット、セミコロンなど)
- `refactor`: バグ修正や機能追加を伴わないコードの改善
- `perf`: パフォーマンス向上のための変更
- `test`: テストの追加や修正
- `chore`: ビルドプロセスやツールの変更、ライブラリの更新など

### コミットメッセージの例

```
feat(auth): AWS Cognito 認証フローを実装

- Authorization Code Flow with PKCE を実装
- セッション管理に iron-session を使用
- ログイン/ログアウト機能を追加

Closes #123
```

```
fix(session): セッションの有効期限チェックを修正
```

```
chore(deps): Next.js を v16 にアップデート
```

## プロジェクト構造

```
.
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reactコンポーネント
│   ├── lib/              # ユーティリティ関数・設定
│   ├── hooks/            # カスタムフック
│   └── types/            # TypeScript型定義
├── public/               # 静的ファイル
├── .env.local            # 環境変数(gitignore)
└── package.json
```

## 開発ガイドライン

### 認証フロー

1. **Authorization Code Flow with PKCE** を使用
2. AWS Cognito の OAuth 2.0 エンドポイントを利用
3. セッション情報は `iron-session` で暗号化して保存

### Next.js v16 の機能

- **App Router**: 最新のルーティング機能を使用
- **Cache Components**: コンポーネントレベルのキャッシング機能を有効化（高速レンダリング）
- **Server Components**: デフォルトでサーバーコンポーネントを使用
- **Server Actions**: フォーム送信やデータ変更に使用

### React v19.2 の機能

- **React Compiler**: 自動メモ化による最適化
- **Actions**: フォームとデータ変更の統合

### TypeScript

- **strict モード**: 有効
- 型安全性を最優先
- `any` 型の使用は避ける

### コンポーネント設計

- **shadcn/ui** を使用したUIコンポーネント
- アクセシビリティを考慮した実装
- レスポンシブデザイン

### コード品質

- ESLint v9 のルールに従う
- Prettier でコードを自動フォーマット
- コミット前に `npm run lint` を実行

## 環境変数

必要な環境変数は `.env.local` に設定してください:

```env
# AWS Cognito
COGNITO_USER_POOL_URL=https://cognito-idp.your-region.amazonaws.com/your-user-pool-id
COGNITO_AUTH_URL=http://your-user-pool-id-sub-domain.auth.your-region.amazoncognito.com
COGNITO_CLIENT_ID=your-client-id
COGNITO_REDIRECT_URI=http://localhost:3000/api/auth/callback
COGNITO_LOGOUT_URI=http://localhost:3000

# Session
SESSION_SECRET=32文字以上のランダムな文字列
```

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番環境での起動
npm start

# リント
npm run lint

# フォーマット
npm run format
```

## AI開発アシスタント向けの注意事項

### コミット作成時

- 必ず Conventional Commits 形式を使用
- 日本語で説明を記述
- 変更内容を明確に記述

### コード作成時

- TypeScript の型を適切に定義
- Next.js v16 と React v19.2 の最新機能を活用
- Server Components と Client Components を適切に使い分け
- `"use client"` ディレクティブを必要な場合のみ使用
- shadcn/ui コンポーネントを優先的に使用
- ESLint と Prettier のルールに従う

### セキュリティ

- 環境変数に機密情報を保存
- クライアントサイドに機密情報を露出させない
- CSRF 対策を実装
- XSS 対策を実装

### パフォーマンス

- React Compiler による自動最適化を活用
- 不要な `useState` や `useEffect` を避ける
- Server Components でのデータフェッチを優先

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [openid-client Documentation](https://github.com/panva/node-openid-client)
- [iron-session Documentation](https://github.com/vvo/iron-session)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Conventional Commits](https://www.conventionalcommits.org/)
