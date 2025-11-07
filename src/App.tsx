import { useState, useEffect, useCallback, useRef } from 'react'
import ChatInterface from './components/ChatInterface'
import Header from './components/Header'
import DataCollectionProgress from './components/DataCollectionProgress'
import SessionInfo from './components/SessionInfo'
import { createSession } from './services/api'
import type { SessionInfo as SessionInfoType, DataCollected } from './types'

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionInfo, setSessionInfo] = useState<SessionInfoType | null>(null)
  const [dataCollected, setDataCollected] = useState<DataCollected>({
    name: false,
    email: false,
    income: false,
  })
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const initializingRef = useRef<boolean>(false)

  useEffect(() => {
    // Initialize session on component mount only
    if (!initializingRef.current && !sessionId) {
      initSession()
    }
  }, [])

  const initSession = async () => {
    // Prevent multiple simultaneous initializations
    if (initializingRef.current) {
      console.log('Session initialization already in progress')
      return
    }
    
    initializingRef.current = true
    
    try {
      const session = await createSession()
      setSessionId(session.session_id)
      setSessionInfo(session)
      setLoading(false)
      console.log('Session created:', session.session_id)
    } catch (error) {
      console.error('Failed to create session:', error)
      setLoading(false)
    } finally {
      initializingRef.current = false
    }
  }

  const handleDataUpdate = useCallback((data: DataCollected) => {
    setDataCollected(data)
  }, [])

  const handleComplete = useCallback((complete: boolean) => {
    setIsComplete(complete)
  }, [])

  const handleNewSession = useCallback(async () => {
    // Prevent multiple simultaneous session creations
    if (initializingRef.current) {
      console.log('Session creation already in progress')
      return
    }
    
    initializingRef.current = true
    
    try {
      setLoading(true)
      console.log('Creating new session...')
      // Create a new session
      const session = await createSession()
      setSessionId(session.session_id)
      setSessionInfo(session)
      // Reset data collection state
      setDataCollected({
        name: false,
        email: false,
        income: false,
      })
      setIsComplete(false)
      setLoading(false)
      console.log('New session created:', session.session_id)
    } catch (error) {
      console.error('Failed to create new session:', error)
      setLoading(false)
    } finally {
      initializingRef.current = false
    }
  }, [])

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="loading-dots flex space-x-2 justify-center mb-4">
            <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
            <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
            <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
          </div>
          <p className="text-gray-600">Initializing session...</p>
        </div>
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
        <div className="text-center bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Session Error</h2>
          <p className="text-gray-600 mb-4">Failed to create session. Please refresh the page.</p>
          <button onClick={initSession} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header onNewSession={handleNewSession} />

      <div className="flex-1 flex overflow-hidden p-4">
        <div className="w-full max-w-[1920px] mx-auto flex gap-6 overflow-hidden">
          {/* Sidebar */}
          <div className="hidden lg:block w-80 space-y-6 flex-shrink-0 overflow-y-auto">
            <SessionInfo sessionInfo={sessionInfo} sessionId={sessionId} />
            <DataCollectionProgress dataCollected={dataCollected} isComplete={isComplete} />
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <ChatInterface
              key={sessionId} // Force remount on new session
              sessionId={sessionId}
              onDataUpdate={handleDataUpdate}
              onComplete={handleComplete}
            />
          </div>
        </div>
      </div>

      {/* Mobile Data Collection Progress */}
      <div className="lg:hidden fixed bottom-20 right-4 left-4">
        <DataCollectionProgress dataCollected={dataCollected} isComplete={isComplete} compact />
      </div>
    </div>
  )
}

export default App
