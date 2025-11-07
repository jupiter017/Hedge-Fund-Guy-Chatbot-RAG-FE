import { Calendar, Hash } from 'lucide-react'
import type { SessionInfo as SessionInfoType } from '../types'

interface SessionInfoProps {
  sessionInfo: SessionInfoType | null
  sessionId: string
}

export default function SessionInfo({ sessionInfo, sessionId }: SessionInfoProps) {
  if (!sessionInfo) return null

  return (
    <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-xl">
      <h3 className="text-lg font-bold mb-4 text-gray-900">Session Info</h3>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Hash className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Session ID</p>
            <p className="text-sm font-mono text-gray-900 break-all">{sessionId}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Started</p>
            <p className="text-sm text-gray-900">
              {new Date(sessionInfo.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <div
              className={`w-3 h-3 rounded-full ${
                sessionInfo.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            ></div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className="text-sm text-gray-900 capitalize">{sessionInfo.status}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
