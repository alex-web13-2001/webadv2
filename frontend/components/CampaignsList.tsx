'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Campaign } from '@/types'

interface CampaignsListProps {
  apiKey: string
  onSelectCampaign: (campaign: Campaign) => void
}

export default function CampaignsList({ apiKey, onSelectCampaign }: CampaignsListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    loadCampaigns()
  }, [apiKey])

  const loadCampaigns = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getCampaigns(apiKey)
      setCampaigns(data)
    } catch (err) {
      setError('Ошибка загрузки кампаний')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (campaign: Campaign) => {
    setSelectedId(campaign.campaignId)
    onSelectCampaign(campaign)
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-600 dark:text-gray-400">Загрузка кампаний...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Рекламные кампании
      </h2>
      <div className="space-y-2">
        {campaigns.map((campaign) => (
          <button
            key={campaign.campaignId}
            onClick={() => handleSelect(campaign)}
            className={`w-full text-left p-4 rounded-lg border-2 transition ${
              selectedId === campaign.campaignId
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{campaign.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {campaign.campaignId} | Бюджет: {campaign.dailyBudget} ₽
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                campaign.status === 9
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {campaign.status === 9 ? 'Активна' : 'Неактивна'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}