import { NextResponse } from 'next/server';

interface Supporter {
  name: string;
  instagram: string;
  amount: number;
  currency: 'USD' | 'IRR';
}

const supporters: Supporter[] = [
  // { name: 'Brian Etemad', instagram: 'brianetemad', amount: 12, currency: 'USD' },
  // { name: 'Alishmas', instagram: 'alishmasz', amount: 420000, currency: 'IRR' },
  // { name: 'SLP', instagram: 'slpabbas', amount: 1000, currency: 'USD' },
  // { name: 'Aria Khosravi', instagram: 'ariaa_khosravi', amount: 3000000, currency: 'IRR' },
  // { name: 'Bashir', instagram: 'bashir.official', amount: 2000000, currency: 'IRR' },
  // { name: 'Ehsan Mombeini', instagram: 'ehsanmobeiniii', amount: 50, currency: 'USD' },
  // { name: 'Erfan Eslahi', instagram: 'erfitunes', amount: 530000, currency: 'IRR' },
  // { name: 'Putak', instagram: 'braveputak', amount: 2500000, currency: 'IRR' },
  // { name: 'Catchy Beatz', instagram: 'tiktaaksr', amount: 3000, currency: 'USD' },
  // { name: 'Behzad Leito', instagram: 'behzadleito', amount: 80, currency: 'USD' },
];

export async function GET() {
  try {
    const supportersUSD = supporters
      .filter((s) => s.currency === 'USD')
      .sort((a, b) => b.amount - a.amount);
    const supportersIRR = supporters
      .filter((s) => s.currency === 'IRR')
      .sort((a, b) => b.amount - a.amount);

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