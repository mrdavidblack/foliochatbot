"use client"

import Card from '@/components/Card'

export default function CardDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Card Component Demo</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Card with Image"
            description="This card displays an image, title and description."
            imageSrc="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
            imageAlt="Sample landscape"
          />

          <Card
            title="Text-only Card"
            description="Cards can be used without images for simple information blocks."
          />

          <Card
            title="Linked Card"
            description="Cards can be clickable by providing an href."
            imageSrc="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
            href="https://nextjs.org"
          />
        </div>
      </div>
    </div>
  )
}


