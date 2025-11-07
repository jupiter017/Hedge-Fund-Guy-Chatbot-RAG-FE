import { Check, X } from 'lucide-react'
import type { DataCollected } from '../types'

interface DataCollectionProgressProps {
  dataCollected: DataCollected
  isComplete: boolean
  compact?: boolean
}

interface Field {
  key: keyof DataCollected
  label: string
  icon: string
}

export default function DataCollectionProgress({
  dataCollected,
  isComplete,
  compact = false,
}: DataCollectionProgressProps) {
  const fields: Field[] = [
    { key: 'name', label: 'Name', icon: '👤' },
    { key: 'email', label: 'Email', icon: '📧' },
    { key: 'income', label: 'Income', icon: '💰' },
  ]

  const collectedCount = Object.values(dataCollected).filter(Boolean).length
  const progress = (collectedCount / fields.length) * 100

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm p-3 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Data Collection</span>
          <span className="text-xs text-gray-500">
            {collectedCount}/{fields.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-xl">
      <h3 className="text-lg font-bold mb-4 text-gray-900">Data Collection Progress</h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">
            {collectedCount}/{fields.length} fields
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Field Status */}
      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.key}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
              dataCollected[field.key]
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{field.icon}</span>
              <span
                className={`font-medium ${
                  dataCollected[field.key] ? 'text-green-700' : 'text-gray-500'
                }`}
              >
                {field.label}
              </span>
            </div>
            {dataCollected[field.key] ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
          <p className="text-sm text-green-700 font-medium text-center">
            ✅ All information collected! Email will be sent automatically.
          </p>
        </div>
      )}
    </div>
  )
}
