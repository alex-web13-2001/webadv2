'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { CampaignStats } from '@/types'
import { formatCurrency, formatNumber, getDateRange } from '@/lib/utils'
import MetricCard from './MetricCard'
import CTRChart from './charts/CTRChart'
import ViewsClicksChart from './charts/ViewsClicksChart'

interface StatsOverviewProps {
  apiKey: string
  campaignId: number
}

export default function StatsOverview({ apiKey, campaignId }: StatsOverviewProps) {
  const [stats, setStats] = useState<CampaignStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState(getDateRange(30))

  useEffect(() => {
    loadStats()
  }, [apiKey, campaignId, dateRange])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getCampaignStats(
        apiKey,
        campaignId,
        dateRange.startDate,
        dateRange.endDate
      )
      setStats(data)
    } catch (err) {
      setError('Ошибка загрузки статистики')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotals = () => {
    return stats.reduce(
      (acc, stat) => ({
        views: acc.views + stat.views,
        clicks: acc.clicks + stat.clicks,
        sum: acc.sum + stat.sum,
        orders: acc.orders + stat.orders,
        sum_price: acc.sum_price + stat.sum_price,
      }),
      { views: 0, clicks: 0, sum: 0, orders: 0, sum_price: 0 }
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-600 dark:text-gray-400">Загрузка статистики...</div>
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

  const totals = calculateTotals()
  const avgCTR = totals.views > 0 ? (totals.clicks / totals.views) * 100 : 0
  const avgCPC = totals.clicks > 0 ? totals.sum / totals.clicks : 0
  const roi = totals.sum > 0 ? ((totals.sum_price - totals.sum) / totals.sum) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Обзор статистики
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Просмотры"
            value={formatNumber(totals.views, 0)}
          />
          <MetricCard
            title="Клики"
            value={formatNumber(totals.clicks, 0)}
          />
          <MetricCard
            title="CTR"
            value={`${formatNumber(avgCTR, 2)}%`}
          />
          <MetricCard
            title="Средний CPC"
            value={formatCurrency(avgCPC)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Затраты"
            value={formatCurrency(totals.sum)}
          />
          <MetricCard
            title="Заказы"
            value={formatNumber(totals.orders, 0)}
          />
          <MetricCard
            title="ROI"
            value={`${formatNumber(roi, 2)}%`}
            change={roi}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CTRChart stats={stats} />
        <ViewsClicksChart stats={stats} />
      </div>
    </div>
  )
}
