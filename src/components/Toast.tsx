import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
  type?: 'success' | 'error' | 'info'
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({ type = 'info', message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  }

  const colors = {
    success: 'from-green-500/20 to-emerald-600/20 border-green-500/30',
    error: 'from-red-500/20 to-rose-600/20 border-red-500/30',
    info: 'from-blue-500/20 to-cyan-600/20 border-blue-500/30',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up max-w-md">
      <div
        className={`glass-effect border p-4 rounded-lg shadow-xl bg-gradient-to-r ${colors[type]}`}
      >
        <div className="flex items-start space-x-3">
          {icons[type]}
          <div className="flex-1">
            <p className="text-sm text-white">{message}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
