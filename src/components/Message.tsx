import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Message as MessageType } from '../types'

interface MessageProps {
  message: MessageType
}

const Message = memo(function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex items-start space-x-3 ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-gray-100 border border-gray-300'
            : 'bg-indigo-600'
        }`}
      >
        <span className={isUser ? 'text-gray-700' : 'text-white'}>
        {isUser ? '👤' : '🤖'}
        </span>
      </div>

      {/* Message Content */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-4 rounded-xl ${
            isUser
              ? 'bg-gray-100 border border-gray-200 rounded-tr-none'
              : 'bg-white border border-gray-200 shadow-sm rounded-tl-none'
          } animate-fade-in`}
        >
          <div className="markdown-content">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        <div className={`mt-1 px-2 text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
})

export default Message
