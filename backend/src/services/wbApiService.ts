import axios, { AxiosError } from 'axios';
import { Campaign, CampaignStats, ClusterStats, ApiResponse } from '../types';

const WB_API_BASE_URL = process.env.WB_API_BASE_URL || 'https://advert-api.wildberries.ru';

export class WBApiService {
  private createHeaders(apiKey: string) {
    return {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    };
  }

  private handleError(error: any): ApiResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;

      if (status === 401) {
        return { success: false, message: 'Неверный API ключ', code: 401 };
      } else if (status === 429) {
        return { success: false, message: 'Превышен лимит запросов. Попробуйте позже', code: 429 };
      } else if (status === 400) {
        return { success: false, message: 'Неправильные параметры запроса', code: 400 };
      }
    }
    return { success: false, message: 'Ошибка соединения с сервером WB', code: 500 };
  }

  async testApiKey(apiKey: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${WB_API_BASE_URL}/adv/v1/balance`, {
        headers: this.createHeaders(apiKey),
      });
      return { success: true, message: 'API ключ валидный', data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCampaigns(apiKey: string): Promise<ApiResponse<Campaign[]>> {
    try {
      const response = await axios.get(`${WB_API_BASE_URL}/adv/v1/promotion/adverts`, {
        headers: this.createHeaders(apiKey),
      });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCampaignStats(
    apiKey: string,
    id: number,
    beginDate: string,
    endDate: string
  ): Promise<ApiResponse<CampaignStats>> {
    try {
      const response = await axios.get(`${WB_API_BASE_URL}/adv/v3/fullstats`, {
        headers: this.createHeaders(apiKey),
        params: {
          ids: id.toString(),
          beginDate,
          endDate,
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getClusterStats(
    apiKey: string,
    advertId: number,
    nmId: number,
    from: string,
    to: string
  ): Promise<ApiResponse<ClusterStats[]>> {
    try {
      const response = await axios.post(
        `${WB_API_BASE_URL}/adv/v0/normquery/stats`,
        {
          from,
          to,
          items: [{ advert_id: advertId, nm_id: nmId }],
        },
        {
          headers: this.createHeaders(apiKey),
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const wbApiService = new WBApiService();