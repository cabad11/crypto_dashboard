// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';

const ETHERSCAN_URL = 'https://api.etherscan.io';
const API_KEY = process.env.ETHERSCAN_API_KEY;
const PAGE_SIZE = 10;

type Transaction = {
  hash: string
  from: string
  to: string | null
  value: string
  timeStamp: string
  chainId: string
  functionName: string | null
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const page = Number(searchParams.get('page') ?? '0');
  const chainId = searchParams.get('chainId');

  if (!address || !address.startsWith('0x') || address.length !== 42) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  try {
    const url = `${ETHERSCAN_URL}/v2/api?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${PAGE_SIZE}&sort=desc&apikey=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();
    let results = [];
    if (data.status !== '1' && data.message === 'NOTOK') {
      console.error('Etherscan error:', data);
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
    results = data.result.map((tx: Transaction) => ({
      hash: tx.hash,
      from: tx.from.toLowerCase(),
      to: tx.to?.toLowerCase() || null,
      value: tx.value,
      timestamp: Number(tx.timeStamp) * 1000,
      chainId,
      functionName: tx.functionName,
    }));

    return NextResponse.json(results);
  }
  catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
