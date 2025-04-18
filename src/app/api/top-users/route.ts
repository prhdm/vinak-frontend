import { NextResponse } from 'next/server';

interface Supporter {
  name: string;
  instagram: string;
  amount: number;
  currency: 'USD' | 'IRR';
}

export async function GET() {
  try {
    console.log('Calling backend at:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/top-users`);
    
    // Make API call to your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/top-users`, {
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

    // Process the data from your backend
    const supporters = data.supporters || [];
    const supportersUSD = supporters
      .filter((s: Supporter) => s.currency === 'USD')
      .sort((a: Supporter, b: Supporter) => b.amount - a.amount);
    const supportersIRR = supporters
      .filter((s: Supporter) => s.currency === 'IRR')
      .sort((a: Supporter, b: Supporter) => b.amount - a.amount);

    const topSupportersUSD = supportersUSD.slice(0, 5);
    const topSupportersIRR = supportersIRR.slice(0, 5);

    return NextResponse.json({
      usd: topSupportersUSD,
      irr: topSupportersIRR
    });
  } catch (error) {
    console.error('Error in top-users:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات' },
      { status: 500 }
    );
  }
} 