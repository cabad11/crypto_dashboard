import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.coingecko.com/api/v3/simple/price', () => {
    return HttpResponse.json({
      ethereum: { usd: 3200, usd_24h_change: 2.5 },
      weth: { usd: 3200, usd_24h_change: 2.5 },
    });
  }),
  http.get('/api/coingecko/simple/price', () => {
    return HttpResponse.json({
      ethereum: { usd: 3200, usd_24h_change: 2.5 },
      weth: { usd: 3200, usd_24h_change: 2.5 },
    });
  }),
  http.get('https://api.coingecko.com/api/v3/coins/weth/market_chart', () => {
    return HttpResponse.json({
      prices: [[123456789, 3200], [123456790, 3210]],
    });
  }),
];
