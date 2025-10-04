"use client"

import React from 'react'

interface CardProps {
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  href?: string
}

export default function Card({ title, description, imageSrc, imageAlt = '', href }: CardProps) {
  const content = (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {imageSrc && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl">
        {content}
      </a>
    )
  }

  return content
}


