import { Campaign, CampaignStats, ClusterStat, ApiResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, options)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'API request failed' }))
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
      const response = await fetch(`${API_URL}/api/test-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })
      const data = await response.json()
      return data.success
    } catch {
      return false
    }
  }

  async getCampaigns(apiKey: string): Promise<Campaign[]> {
    return this.request<Campaign[]>('/api/campaigns', {
      headers: {
        'x-api-key': apiKey,
      },
    })
  }

  async getCampaignStats(
    apiKey: string,
    campaignId: number,
    startDate: string,
    endDate: string
  ): Promise<CampaignStats[]> {
    const params = new URLSearchParams({
      beginDate: startDate,
      endDate: endDate,
    })
    return this.request<CampaignStats[]>(
      `/api/campaign/${campaignId}/stats?${params}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    )
  }

  async getClustersStats(
    apiKey: string,
    campaignId: number,
    nmId: number,
    startDate: string,
    endDate: string
  ): Promise<ClusterStat[]> {
    return this.request<ClusterStat[]>(
      `/api/campaign/${campaignId}/clusters`,
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nm_id: nmId,
          from: startDate,
          to: endDate,
        }),
      }
    )
  }
}

export const apiClient = new ApiClient()