// ============================================================
// Health Check Endpoint — Docker HEALTHCHECK / Nginx 監視用
// 常に 200 OK を返し、サーバーが生きていることを示す
// ============================================================
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
