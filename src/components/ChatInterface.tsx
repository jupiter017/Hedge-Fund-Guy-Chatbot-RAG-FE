import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Loader2 } from 'lucide-react'
import Message from './Message'
import Toast from './Toast'
import { sendMessageStream } from '../services/api'
import type { Message as MessageType, DataCollected } from '../types'

interface ChatInterfaceProps {
  sessionId: string
  onDataUpdate: (data: DataCollected) => void
  onComplete: (complete: boolean) => void
}

interface ToastData {
  type: 'success' | 'error' | 'info'
  message: string
}

export default function ChatInterface({ sessionId, onDataUpdate, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [streamingContent, setStreamingContent] = useState<string>('')
  const [toast, setToast] = useState<ToastData | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentMessageIdRef = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Use refs to store the latest callback values without triggering re-renders
  const onDataUpdateRef = useRef(onDataUpdate)
  const onCompleteRef = useRef(onComplete)
  
  useEffect(() => {
    onDataUpdateRef.current = onDataUpdate
    onCompleteRef.current = onComplete
  }, [onDataUpdate, onComplete])

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  useEffect(() => {
    // Auto-focus input on mount and after sending a message
    inputRef.current?.focus()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    const userMessage: MessageType = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageContent = inputValue
    setInputValue('')
    setIsLoading(true)
    setStreamingContent('')
    
    // Create a new message ID for the assistant's response
    const assistantMessageId = Date.now() + 1
    currentMessageIdRef.current = assistantMessageId
    
    let fullContent = ''

    try {
      await sendMessageStream(
        sessionId,
        messageContent,
        // On chunk received
        (chunk: string) => {
          fullContent += chunk
          setStreamingContent(fullContent)
        },
        // On complete
        (data) => {
          // Add the complete message to the messages array
          const completeMessage: MessageType = {
            id: assistantMessageId,
            role: 'assistant',
            content: fullContent,
            timestamp: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, completeMessage])
          setStreamingContent('')
          setIsLoading(false)
          
          // Update data collection status
          onDataUpdateRef.current(data.data_collected)
          onCompleteRef.current(data.is_complete)
        },
        // On error
        (error) => {
          setToast({
            type: 'error',
            message: `Error: ${error}`,
          })
          setStreamingContent('')
          setIsLoading(false)
        }
      )
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to send message',
      })
      setStreamingContent('')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      {/* Connection Status */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">Connected</span>
        </div>
        <span className="text-xs text-gray-500">Session: {sessionId.slice(0, 8)}...</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">👋 Start chatting with the market wizard</p>
              <p className="text-sm text-gray-400">Ask about stocks, strategies, or market trends</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {/* Streaming message */}
        {isLoading && streamingContent && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white">🤖</span>
            </div>
            <div className="max-w-[80%]">
              <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-xl rounded-tl-none animate-fade-in">
                <div className="markdown-content">
                  {streamingContent}
                  <span className="inline-block w-2 h-4 bg-indigo-600 animate-pulse ml-1"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator (when waiting for first chunk) */}
        {isLoading && !streamingContent && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white">🤖</span>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-xl rounded-tl-none">
              <div className="loading-dots flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about stocks, strategies, or market trends..."
            className="input-field flex-1"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
