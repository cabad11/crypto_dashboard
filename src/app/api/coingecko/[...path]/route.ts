import COINGECKO_ID_MAP from '@/constants/coingeckoIdMap';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECONDS = 60;
const REVALIDATE_HISTORY_SECONDS = 3600;

export const revalidate = 60;

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: pathParam } = await params;
  const path = pathParam.join('/');
  const searchParams = request.nextUrl.searchParams;

  const allowedPaths = [
    'simple/price',
    ...Object.values(COINGECKO_ID_MAP).map(id => `coins/${id}/market_chart`),
  ];

  const fullPath = `${path}?${searchParams.toString()}`;
  if (!allowedPaths.some(p => fullPath.startsWith(p))) {
    return new NextResponse('Not allowed', { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${COINGECKO_BASE}/${fullPath}`, {
      signal: controller.signal,
      headers: {
        accept: 'application/json',
      },
      next: {
        revalidate: fullPath.includes('market_chart') ? REVALIDATE_HISTORY_SECONDS : REVALIDATE_SECONDS,
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const error = await res.text();
      console.error('Coingecko error:', res.status, error);
      return new NextResponse('Coingecko error', { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    if (error.name === 'AbortError') {
      return new NextResponse('Timeout', { status: 504 });
    }
    console.error('Coingecko proxy error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
