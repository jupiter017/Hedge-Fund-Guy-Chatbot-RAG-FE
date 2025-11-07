import axios, { AxiosInstance } from 'axios'
import type {
  SessionInfo,
  SessionData,
  ChatMessage,
  ChatResponse,
  GreetingResponse,
  HealthCheck,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Session management
export const createSession = async (): Promise<SessionInfo> => {
  const response = await api.post<SessionInfo>('/api/sessions')
  return response.data
}

export const getSession = async (sessionId: string): Promise<SessionData> => {
  const response = await api.get<SessionData>(`/api/sessions/${sessionId}`)
  return response.data
}

export const getAllSessions = async (): Promise<SessionData[]> => {
  const response = await api.get<SessionData[]>('/api/sessions')
  return response.data
}

// Chat
export const sendMessage = async (
  sessionId: string,
  message: string
): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>('/api/chat', {
    message,
    session_id: sessionId,
  })
  return response.data
}

// Streaming chat with SSE
export const sendMessageStream = async (
  sessionId: string,
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: (data: { data_collected: DataCollected; is_complete: boolean }) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('Response body is null')
    }

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            
            if (data.type === 'chunk') {
              onChunk(data.content)
            } else if (data.type === 'done') {
              onComplete({
                data_collected: data.data_collected,
                is_complete: data.is_complete,
              })
            } else if (data.type === 'error') {
              onError(data.message)
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e)
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Unknown error')
  }
}

export const getGreeting = async (): Promise<GreetingResponse> => {
  const response = await api.get<GreetingResponse>('/api/greeting')
  return response.data
}

// Health check
export const checkHealth = async (): Promise<HealthCheck> => {
  const response = await api.get<HealthCheck>('/health')
  return response.data
}

// Admin Dashboard
export const getAdminDashboard = async () => {
  const response = await api.get('/api/admin/dashboard')
  return response.data
}

// WebSocket connection
export const createWebSocketConnection = (sessionId: string): WebSocket => {
  return new WebSocket(`${WS_BASE_URL}/ws/${sessionId}`)
}

export default api
