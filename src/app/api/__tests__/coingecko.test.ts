import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../coingecko/[...path]/route';

describe('/api/coingecko', () => {
  it('/simple/price should return coins prices', async () => {
    const response = await GET(new NextRequest('http://localhost/api/coingecko/simple/price?ids=ethereum,weth&vs_currencies=usd&include_24hr_change=true'), { params: Promise.resolve({ path: ['simple', 'price'] }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ethereum.usd).toBe(3200);
    expect(data.weth.usd).toBe(3200);
  });

  it('/coins/{coin}/market_chart should return coin price history', async () => {
    const response = await GET(new NextRequest('http://localhost/api/coingecko/coins/weth/market_chart'), { params: Promise.resolve({ path: ['coins', 'weth', 'market_chart'] }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    const [ts, price] = data.prices[0];
    expect(ts).toBe(123456789);
    expect(price).toBe(3200);
  });

  it('should return 403 on not allowed path', async () => {
    const response = await GET(new NextRequest('http://localhost/api/coingecko/coins/something'), { params: Promise.resolve({ path: ['something'] }) });

    expect(response.status).toBe(403);
  });
});
