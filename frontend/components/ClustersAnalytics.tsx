'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { ClusterStat } from '@/types'
import { formatCurrency, formatNumber, getDateRange } from '@/lib/utils'
import ClustersChart from './charts/ClustersChart'

interface ClustersAnalyticsProps {
  apiKey: string
  campaignId: number
}

export default function ClustersAnalytics({ apiKey, campaignId }: ClustersAnalyticsProps) {
  const [clusters, setClusters] = useState<ClusterStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState(getDateRange(30))

  useEffect(() => {
    loadClusters()
  }, [apiKey, campaignId, dateRange])

  const loadClusters = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getClustersStats(
        apiKey,
        campaignId,
        dateRange.startDate,
        dateRange.endDate
      )
      setClusters(data)
    } catch (err) {
      setError('Ошибка загрузки кластеров')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-600 dark:text-gray-400">Загрузка кластеров...</div>
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Аналитика по кластерам
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Кластер</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Просмотры</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Клики</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">CTR</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">CPC</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Затраты</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Заказы</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Выкупы</th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((cluster, index) => (
                <tr
                  key={index}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {cluster.cluster}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatNumber(cluster.views, 0)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatNumber(cluster.clicks, 0)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatNumber(cluster.ctr, 2)}%
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatCurrency(cluster.cpc)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatCurrency(cluster.sum)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatNumber(cluster.ordersCount, 0)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatNumber(cluster.buyoutsCount, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ClustersChart clusters={clusters} />
    </div>
  )
}