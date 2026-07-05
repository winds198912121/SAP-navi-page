import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'SAP パンダ先生 NAVI — SAP学習プラットフォーム',
  description: '未経験からSAPコンサルタントへ。日本最大級のSAP学習プラットフォーム。',
  openGraph: {
    title: 'SAP パンダ先生 NAVI',
    description: '未経験からSAPコンサルタントへ。',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
