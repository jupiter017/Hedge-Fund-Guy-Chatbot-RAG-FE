// Type definitions for the application

export interface SessionInfo {
  session_id: string
  timestamp: string
  status: 'active' | 'complete'
}

export interface DataCollected {
  name: boolean
  email: boolean
  income: boolean
}

export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatMessage {
  message: string
  session_id?: string
}

export interface ChatResponse {
  response: string
  session_id: string
  data_collected: DataCollected
  is_complete: boolean
}

export interface SessionData {
  session_id: string
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
  status: 'active' | 'complete'
  completed_at?: string
}

export interface HealthCheck {
  status: string
  rag_ready: boolean
  storage_ready: boolean
  email_ready: boolean
}

export interface GreetingResponse {
  greeting: string
}

export interface WebSocketMessage {
  type: 'greeting' | 'message' | 'email_sent'
  message: string
  data_collected?: DataCollected
  is_complete?: boolean
}

