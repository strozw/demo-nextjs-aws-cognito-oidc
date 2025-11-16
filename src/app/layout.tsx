import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AWS Cognito Auth Sample',
  description: 'Sample application with AWS Cognito authentication',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
