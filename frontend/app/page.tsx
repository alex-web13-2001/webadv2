'use client'

import { useState } from 'react'
import ApiKeyInput from '@/components/ApiKeyInput'
import CampaignsList from '@/components/CampaignsList'
import StatsOverview from '@/components/StatsOverview'
import ClustersAnalytics from '@/components/ClustersAnalytics'
import { Campaign } from '@/types'

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('')
  const [isValidKey, setIsValidKey] = useState<boolean>(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Wildberries Ads Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Анализ рекламных кампаний и статистики
          </p>
        </header>

        {!isValidKey ? (
          <ApiKeyInput onValidKey={(key) => {
            setApiKey(key)
            setIsValidKey(true)
          }} />
        ) : (
          <div className="space-y-6">
            <CampaignsList 
              apiKey={apiKey}
              onSelectCampaign={setSelectedCampaign}
            />
            
            {selectedCampaign && (
              <>
                <StatsOverview 
                  apiKey={apiKey}
                  campaignId={selectedCampaign.campaignId}
                />
                
                <ClustersAnalytics 
                  apiKey={apiKey}
                  campaignId={selectedCampaign.campaignId}
                />
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}