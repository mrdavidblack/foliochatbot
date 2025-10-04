'use client'

import React from 'react'
import PromptBar from '@/components/PromptBar'

export default function PromptDemo() {
  const [messages, setMessages] = React.useState<string[]>([])

  function handleSend(value: string) {
    setMessages((prev) => [value, ...prev])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">PromptBar Demo</h1>

        <div className="bg-white rounded-xl shadow p-6">
          <PromptBar onSend={handleSend} />

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Submitted Prompts</h2>
            {messages.length === 0 ? (
              <p className="text-gray-500">No prompts yet. Try submitting one above.</p>
            ) : (
              <ul className="space-y-2">
                {messages.map((msg, idx) => (
                  <li key={idx} className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">
                    {msg}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


