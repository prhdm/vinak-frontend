import { NextResponse } from 'next/server';

interface TopUser {
  name: string;
  instagram_id: string;
  total_amount: number;
}

interface TopSupportersResponse {
  top_users: TopUser[];
}

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/top-users`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`Failed to fetch top users: ${response.status} ${response.statusText}`);
    }

    const data: TopSupportersResponse = await response.json();
    
    // تبدیل داده‌ها به فرمت مورد نیاز
    const supporters = data.top_users.map((user: TopUser) => {
      // اگر مبلغ کمتر از 1000 باشد، فرض می‌کنیم دلار است
      // اگر مبلغ بین 1000 تا 1000000 باشد، فرض می‌کنیم nowpayments است
      // اگر مبلغ بیشتر از 1000000 باشد، فرض می‌کنیم ریال است
      let currency: 'IRR' | 'USD' | 'NOW' = 'IRR';
      if (user.total_amount < 1000) {
        currency = 'USD';
      } else if (user.total_amount < 1000000) {
        currency = 'NOW';
      }
      
      return {
        name: user.name,
        instagram: user.instagram_id,
        amount: user.total_amount,
        currency
      };
    });

    return NextResponse.json({ supporters });
  } catch (error) {
    console.error('Error fetching top users:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch top users',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 