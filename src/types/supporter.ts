export interface Supporter {
  name: string;
  instagram_id: string;
  total_amount: number;
  currency: 'USD';
}

export interface TopSupportersResponse {
  top_users: Supporter[];
}

export interface ConvertedSupporter {
  name: string;
  instagram: string;
  amount: number;
  currency: 'USD';
} 