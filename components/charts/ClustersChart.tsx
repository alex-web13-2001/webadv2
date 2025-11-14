'use client'

import { ClusterStat } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface ClustersChartProps {
  clusters: ClusterStat[]
}

export default function ClustersChart({ clusters }: ClustersChartProps) {
  const maxSum = Math.max(...clusters.map(c => c.sum))
  const maxOrders = Math.max(...clusters.map(c => c.ordersCount))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Затраты и заказы по кластерам
      </h3>
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Затраты</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-teal-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Заказы</span>
        </div>
      </div>
      <div className="h-64 flex items-end justify-between gap-2">
        {clusters.map((cluster, index) => {
          const sumHeight = maxSum > 0 ? (cluster.sum / maxSum) * 100 : 0
          const ordersHeight = maxOrders > 0 ? (cluster.ordersCount / maxOrders) * 100 : 0
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div className="w-full flex gap-1 justify-center items-end h-full">
                <div
                  className="flex-1 bg-orange-500 hover:bg-orange-600 transition-all rounded-t"
                  style={{ height: `${sumHeight}%` }}
                  title={`${cluster.cluster}\nЗатраты: ${formatCurrency(cluster.sum)}`}
                />
                <div
                  className="flex-1 bg-teal-500 hover:bg-teal-600 transition-all rounded-t"
                  style={{ height: `${ordersHeight}%` }}
                  title={`${cluster.cluster}\nЗаказы: ${formatNumber(cluster.ordersCount, 0)}`}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate max-w-full">
                {cluster.cluster.length > 10 ? cluster.cluster.substring(0, 10) + '...' : cluster.cluster}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Наведите на столбец для просмотра деталей
      </div>
    </div>
  )
}