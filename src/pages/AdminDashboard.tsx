import { useState, useEffect } from 'react'
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Activity, 
  TrendingUp, 
  Database,
  Mail,
  DollarSign,
  Clock,
  BarChart3,
  RefreshCw,
  X,
  Settings,
  Save,
  AlertCircle,
  ArrowLeft,
  Home
} from 'lucide-react'
import { getAdminDashboard, getAdminSettings, updateAdminSettings } from '../services/api'

interface DashboardData {
  statistics: {
    total_sessions: number
    completed_sessions: number
    active_sessions: number
    total_messages: number
    data_collection: {
      names_collected: number
      emails_collected: number
      incomes_collected: number
      completion_rate: number
    }
  }
  system_health: {
    rag_ready: boolean
    storage_ready: boolean
    email_ready: boolean
    rag_vectors: number
  }
  recent_sessions: Array<{
    session_id: string
    status: string
    timestamp: string
    data: {
      name: string | null
      email: string | null
      income: string | null
    }
    conversation_history: Array<{
      role: string
      content: string
      timestamp: string
    }>
    message_count: number
  }>
}

interface AdminSettings {
  recipient_email: string | null
  email_notifications_enabled: boolean
  auto_send_on_complete: boolean
  is_configured: boolean
}

type TabType = 'overview' | 'sessions' | 'settings'

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [selectedSession, setSelectedSession] = useState<DashboardData['recent_sessions'][0] | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Settings state
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    fetchDashboardData()
    fetchSettings()
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true)
      const dashboardData = await getAdminDashboard()
      setData(dashboardData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const settingsData = await getAdminSettings()
      setSettings(settingsData)
      setRecipientEmail(settingsData.recipient_email || '')
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }

  const handleSaveSettings = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setSettingsMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }

    try {
      setIsSavingSettings(true)
      setSettingsMessage(null)
      const updatedSettings = await updateAdminSettings(recipientEmail)
      setSettings(updatedSettings)
      setSettingsMessage({ type: 'success', text: 'Settings saved successfully!' })
      
      // Clear success message after 3 seconds
      setTimeout(() => setSettingsMessage(null), 3000)
    } catch (err) {
      setSettingsMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save settings' 
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    )
  }

  const { statistics, system_health, recent_sessions } = data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back to Chat Button */}
              <a
                href="/"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 group"
                title="Back to Chat"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Chat</span>
              </a>
              
              <div className="border-l border-gray-300 h-8"></div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Hedge Fund Chatbot Analytics & Monitoring
                </p>
              </div>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={isRefreshing}
              className={`flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all ${
                isRefreshing ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>System Health & Statistics</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'sessions'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Data Collection & Sessions</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* System Health */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatusCard
                  title="RAG System"
                  status={system_health.rag_ready}
                  icon={<Database className="w-5 h-5" />}
                  detail={`${system_health.rag_vectors} vectors`}
                />
                <StatusCard
                  title="Database"
                  status={system_health.storage_ready}
                  icon={<Activity className="w-5 h-5" />}
                  detail="PostgreSQL"
                />
                <StatusCard
                  title="Email Service"
                  status={system_health.email_ready}
                  icon={<Mail className="w-5 h-5" />}
                  detail="SMTP"
                />
                <StatusCard
                  title="Overall"
                  status={system_health.rag_ready && system_health.storage_ready}
                  icon={<CheckCircle className="w-5 h-5" />}
                  detail="Operational"
                />
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Sessions"
                  value={statistics.total_sessions}
                  icon={<Users className="w-6 h-6 text-indigo-600" />}
                  bgColor="bg-indigo-50"
                />
                <StatCard
                  title="Completed Sessions"
                  value={statistics.completed_sessions}
                  icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                  bgColor="bg-green-50"
                  subtitle={`${statistics.data_collection.completion_rate}% completion rate`}
                />
                <StatCard
                  title="Active Sessions"
                  value={statistics.active_sessions}
                  icon={<Activity className="w-6 h-6 text-blue-600" />}
                  bgColor="bg-blue-50"
                />
                <StatCard
                  title="Total Messages"
                  value={statistics.total_messages}
                  icon={<MessageSquare className="w-6 h-6 text-purple-600" />}
                  bgColor="bg-purple-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-8">
            {/* Data Collection Stats */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Collection</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DataCollectionStat
                    title="Names Collected"
                    value={statistics.data_collection.names_collected}
                    total={statistics.total_sessions}
                    icon={<Users className="w-5 h-5 text-indigo-600" />}
                  />
                  <DataCollectionStat
                    title="Emails Collected"
                    value={statistics.data_collection.emails_collected}
                    total={statistics.total_sessions}
                    icon={<Mail className="w-5 h-5 text-blue-600" />}
                  />
                  <DataCollectionStat
                    title="Incomes Collected"
                    value={statistics.data_collection.incomes_collected}
                    total={statistics.total_sessions}
                    icon={<DollarSign className="w-5 h-5 text-green-600" />}
                  />
                </div>
              </div>
            </div>

            {/* All Sessions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">All Sessions</h2>
                <span className="text-sm text-gray-500">
                  Showing {recent_sessions.length} session{recent_sessions.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Session ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Income
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Messages
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recent_sessions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p>No sessions found</p>
                          </td>
                        </tr>
                      ) : (
                        recent_sessions.map((session) => (
                        <tr
                          key={session.session_id}
                          onClick={() => setSelectedSession(session)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                            {session.session_id.slice(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                session.status === 'complete'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {session.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.data.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.data.email || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.data.income || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {session.message_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(session.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Email Settings</h2>
                  <p className="text-sm text-gray-500">Configure the recipient email address for notifications</p>
                </div>
              </div>

              {settingsMessage && (
                <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
                  settingsMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {settingsMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm font-medium ${
                    settingsMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {settingsMessage.text}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    id="recipientEmail"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    This email will receive notifications when users complete their data collection.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    {settings?.is_configured ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Email configured</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm text-amber-600 font-medium">Email not configured</span>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className={`flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all ${
                      isSavingSettings ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingSettings ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Settings Info */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">How it works</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>When a user completes data collection (name, email, income), an email notification is sent</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>The notification includes all collected user information and conversation history</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>You can view all sessions and their data in the "Data Collection & Sessions" tab</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  )
}

// Helper Components
interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  bgColor: string
  subtitle?: string
}

const StatCard = ({ title, value, icon, bgColor, subtitle }: StatCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
)

interface StatusCardProps {
  title: string
  status: boolean
  icon: React.ReactNode
  detail: string
}

const StatusCard = ({ title, status, icon, detail }: StatusCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${status ? 'bg-green-50' : 'bg-red-50'}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{detail}</p>
        </div>
      </div>
      <div
        className={`w-3 h-3 rounded-full ${
          status ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
    </div>
  </div>
)

interface DataCollectionStatProps {
  title: string
  value: number
  total: number
  icon: React.ReactNode
}

const DataCollectionStat = ({ title, value, total, icon }: DataCollectionStatProps) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {value} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{percentage}% collected</p>
    </div>
  )
}

interface SessionModalProps {
  session: DashboardData['recent_sessions'][0]
  onClose: () => void
}

const SessionModal = ({ session, onClose }: SessionModalProps) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Session Details</h3>
              <p className="text-sm text-gray-500 font-mono mt-1">{session.session_id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Session Info */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Session Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                      session.status === 'complete'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(session.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {session.data.name || 'Not collected'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {session.data.email || 'Not collected'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Income</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {session.data.income || 'Not collected'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Messages</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {session.message_count}
                  </p>
                </div>
              </div>
            </div>

            {/* Conversation History */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Conversation History</h4>
              {session.conversation_history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No messages in this session</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {session.conversation_history.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-gray-100 border border-gray-200'
                          : 'bg-indigo-50 border border-indigo-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-semibold uppercase ${
                            message.role === 'user' ? 'text-gray-700' : 'text-indigo-700'
                          }`}
                        >
                          {message.role === 'user' ? '👤 User' : '🤖 Assistant'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard


