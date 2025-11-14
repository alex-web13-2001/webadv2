export interface Campaign {
  advertId: number;
  name: string;
  type: number;
  status: number;
  createTime: string;
}

export interface CampaignStats {
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  sum: number;
  orders: number;
  days: DayStats[];
}

export interface DayStats {
  date: string;
  views: number;
  clicks: number;
  ctr: number;
  cpc: number;
  sum: number;
}

export interface ClusterStats {
  norm_query: string;
  avg_pos: number;
  clicks: number;
  views: number;
  ctr: number;
  cpc: number;
  cpm: number;
  orders: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}