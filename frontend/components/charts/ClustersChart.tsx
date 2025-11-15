'use client'

import { ClusterStat } from '@/types'
import { formatNumber } from '@/lib/utils'

interface ClustersChartProps {
  clusters: ClusterStat[]
}

export default function ClustersChart({ clusters }: ClustersChartProps) {
  // Sort clusters by CTR and take top 10
  const topClusters = [...clusters]
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, 10)

  const maxCTR = Math.max(...topClusters.map(c => c.ctr))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        ТОП 10 поисковых запросов по CTR
      </h3>
      <div className="space-y-3">
        {topClusters.map((cluster, index) => {
          const width = maxCTR > 0 ? (cluster.ctr / maxCTR) * 100 : 0
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-48 truncate text-sm text-gray-700 dark:text-gray-300">
                {cluster.norm_query}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${width}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {formatNumber(cluster.ctr, 2)}%
                  </span>
                </div>
              </div>
              <div className="w-20 text-sm text-gray-600 dark:text-gray-400 text-right">
                {formatNumber(cluster.clicks, 0)} кл.
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
