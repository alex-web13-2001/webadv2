'use client'

import { CampaignStats } from '@/types'
import { formatDate } from '@/lib/utils'

interface CTRChartProps {
  stats: CampaignStats[]
}

export default function CTRChart({ stats }: CTRChartProps) {
  const maxCTR = Math.max(...stats.map(s => s.ctr))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        CTR по дням
      </h3>
      <div className="h-64 flex items-end justify-between gap-1">
        {stats.map((stat, index) => {
          const height = maxCTR > 0 ? (stat.ctr / maxCTR) * 100 : 0
          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div className="w-full flex flex-col justify-end h-full">
                <div
                  className="w-full bg-blue-500 hover:bg-blue-600 transition-all rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${formatDate(stat.date)}: ${stat.ctr.toFixed(2)}%`}
                />
              </div>
              {index % Math.ceil(stats.length / 7) === 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 rotate-45 origin-top-left">
                  {formatDate(stat.date)}
                </span>
              )}
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
