import { Campaign, CampaignStats, ClusterStat, ApiResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiClient {
  private async request<T>(endpoint: string, apiKey: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'X-WB-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    const data: ApiResponse<T> = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'API request failed')
    }

    return data.data as T
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      await this.request<any>('/api/validate-key', apiKey)
      return true
    } catch {
      return false
    }
  }

  async getCampaigns(apiKey: string): Promise<Campaign[]> {
    return this.request<Campaign[]>('/api/campaigns', apiKey)
  }

  async getCampaignStats(
    apiKey: string,
    campaignId: number,
    startDate: string,
    endDate: string
  ): Promise<CampaignStats[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    })
    return this.request<CampaignStats[]>(
      `/api/campaigns/${campaignId}/stats?${params}`,
      apiKey
    )
  }

  async getClustersStats(
    apiKey: string,
    campaignId: number,
    startDate: string,
    endDate: string
  ): Promise<ClusterStat[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    })
    return this.request<ClusterStat[]>(
      `/api/campaigns/${campaignId}/clusters?${params}`,
      apiKey
    )
  }
}

export const apiClient = new ApiClient()