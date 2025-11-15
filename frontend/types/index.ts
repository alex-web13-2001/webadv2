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
  cpm: number;
  sum: number;
  orders: number;
}

export interface ClusterStat {
  norm_query: string;
  avg_pos: number;
  clicks: number;
  views: number;
  ctr: number;
  cpc: number;
  cpm: number;
  sum: number;
  orders: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}