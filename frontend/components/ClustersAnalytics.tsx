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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState(getDateRange(30))
  const [nmId, setNmId] = useState('')
  const [hasLoaded, setHasLoaded] = useState(false)

  const loadClusters = async () => {
    if (!nmId) {
      setError('Введите артикул товара (nm_id)')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      const data = await apiClient.getClustersStats(
        apiKey,
        campaignId,
        parseInt(nmId),
        dateRange.startDate,
        dateRange.endDate
      )
      setClusters(data)
      setHasLoaded(true)
    } catch (err) {
      setError('Ошибка загрузки кластеров. Проверьте артикул товара.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasLoaded) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Аналитика по кластерам
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Введите артикул товара (nm_id) для загрузки аналитики поисковых кластеров
        </p>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="nmId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Артикул товара (nm_id)
            </label>
            <input
              type="number"
              id="nmId"
              value={nmId}
              onChange={(e) => setNmId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Например: 123456789"
            />
          </div>
          <button
            onClick={loadClusters}
            disabled={isLoading || !nmId}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Загрузка...' : 'Загрузить'}
          </button>
        </div>
        {error && (
          <div className="mt-4 text-red-500 text-sm">{error}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Аналитика по кластерам
          </h2>
          <button
            onClick={() => setHasLoaded(false)}
            className="text-sm text-primary hover:text-primary/90 transition"
          >
            Изменить артикул
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Поисковый запрос</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Просмотры</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Клики</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">CTR</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">CPC</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Затраты</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Заказы</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Средняя позиция</th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((cluster, index) => (
                <tr
                  key={index}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {cluster.norm_query}
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
                    {formatNumber(cluster.orders, 0)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {formatNumber(cluster.avg_pos, 1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {clusters.length > 0 && <ClustersChart clusters={clusters} />}
    </div>
  )
}