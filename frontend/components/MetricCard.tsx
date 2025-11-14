interface MetricCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  change?: number
  className?: string
}

export default function MetricCard({ title, value, icon, change, className = '' }: MetricCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}> 
      <div className="flex items-center justify-between mb-2"> 
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3> 
        {icon && <div className="text-gray-400">{icon}</div>} 
      </div> 
      <div className="flex items-baseline justify-between"> 
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p> 
        {change !== undefined && ( 
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}> 
            {change >= 0 ? '+' : ''}{change.toFixed(2)}% 
          </span> 
        )} 
      </div> 
    </div> 
  )
}