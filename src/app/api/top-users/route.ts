import { NextResponse } from 'next/server';

interface Supporter {
  name: string;
  instagram: string;
  amount: number;
  currency: 'USD' | 'IRR';
}

export async function GET() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/top-users`;
    console.log('Calling backend at:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend response not OK:', response.status, response.statusText);
      throw new Error('Failed to fetch supporters from backend');
    }

    const data = await response.json();
    console.log('Received data from backend:', data);

    const rawSupporters = data?.supporters;
    const supporters: Supporter[] = Array.isArray(rawSupporters) ? rawSupporters : [];

    const supportersUSD = supporters
      .filter((s) => s.currency === 'USD')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const supportersIRR = supporters
      .filter((s) => s.currency === 'IRR')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return NextResponse.json({
      usd: supportersUSD,
      irr: supportersIRR,
    });
  } catch (error) {
    console.error('Error in top-users:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات' },
      { status: 500 }
    );
  }
}
