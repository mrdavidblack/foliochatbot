'use client'

import React from 'react'

interface PromptBarProps {
  onSend: (value: string) => void
  placeholder?: string
  disabled?: boolean
  initialValue?: string
  className?: string
}

export default function PromptBar({
  onSend,
  placeholder = 'Type your prompt...'
  ,disabled = false,
  initialValue = '',
  className = ''
}: PromptBarProps) {
  const [value, setValue] = React.useState(initialValue)

  const canSend = !disabled && value.trim().length > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSend) return
    onSend(value.trim())
    setValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend) {
        onSend(value.trim())
        setValue('')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 w-full ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!canSend}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  )
}


