import { TrendingUp, Plus, LayoutDashboard } from 'lucide-react'

interface HeaderProps {
  onNewSession?: () => void
  showAdminLink?: boolean
}

export default function Header({ onNewSession, showAdminLink = true }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Insomniac Hedge Fund Guy
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Stock Market Wizard</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {showAdminLink && (
              <a
                href="/admin"
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Admin</span>
              </a>
            )}
            
            {onNewSession && (
              <button
                onClick={onNewSession}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">New Session</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
