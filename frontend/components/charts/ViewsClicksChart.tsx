'use client'

import { CampaignStats } from '@/types'
import { formatDate, formatNumber } from '@/lib/utils'

interface ViewsClicksChartProps {
  stats: CampaignStats[]
}

export default function ViewsClicksChart({ stats }: ViewsClicksChartProps) {
  const maxViews = Math.max(...stats.map(s => s.views))
  const maxClicks = Math.max(...stats.map(s => s.clicks))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Просмотры и клики по дням
      </h3>
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Просмотры</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Клики</span>
        </div>
      </div>
      <div className="h-64 flex items-end justify-between gap-1">
        {stats.map((stat, index) => {
          const viewsHeight = maxViews > 0 ? (stat.views / maxViews) * 100 : 0
          const clicksHeight = maxClicks > 0 ? (stat.clicks / maxClicks) * 100 : 0
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div className="w-full flex flex-col justify-end h-full gap-1">
                <div
                  className="w-full bg-green-500 hover:bg-green-600 transition-all rounded-t opacity-70"
                  style={{ height: `${viewsHeight}%` }}
                  title={`${formatDate(stat.date)}\nПросмотры: ${formatNumber(stat.views, 0)}`}
                />
                <div
                  className="w-full bg-purple-500 hover:bg-purple-600 transition-all rounded-t"
                  style={{ height: `${clicksHeight}%` }}
                  title={`${formatDate(stat.date)}\nКлики: ${formatNumber(stat.clicks, 0)}`}
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
