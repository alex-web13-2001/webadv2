export interface Campaign {
  campaignId: number;
  name: string;
  type: number;
  status: number;
  dailyBudget: number;
  advertId: number;
}

export interface CampaignStats {
  date: string;
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  shks: number;
  sum_price: number;
}

export interface ClusterStat {
  cluster: string;
  count: number;
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
  addToCartCount: number;
  ordersCount: number;
  ordersSumRub: number;
  buyoutsCount: number;
  buyoutsSumRub: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}