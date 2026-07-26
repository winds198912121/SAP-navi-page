// ============================================================
// SSR Render Endpoint — WordPress テーマから呼ばれる
//
// 使用方法:
//   GET /render?path=/courses&basename=/sap
//
// WordPress の sap_panda_fetch_ssr() がリクエストし、
// レンダリング済みの <div id="root"> 内 HTML を JSON で返す。
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

// 同じサーバーインスタンスのベースURL
const BASE = `http://localhost:${process.env.PORT || 3000}`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '/';
  // basename は StaticRouter 用だが、このエンドポイントでは path をそのまま使う

  try {
    const response = await fetch(`${BASE}${path}`, {
      signal: AbortSignal.timeout(15000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SAP-Panda-SSR/1.0)',
        Accept: 'text/html',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: 502 }
      );
    }

    const html = await response.text();

    // Next.js 14 の SSR 出力から <body> 内のコンテンツを抽出
    const bodyMatch = html.match(
      /<body[^>]*>([\s\S]*?)<\/body>/i
    );

    if (!bodyMatch) {
      return NextResponse.json(
        { error: 'Body element not found in rendered page' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      html: bodyMatch[1].trim(),
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Render failed: ${message}` },
      { status: 502 }
    );
  }
}

// SSR エンドポイントは常に動的
export const dynamic = 'force-dynamic';
