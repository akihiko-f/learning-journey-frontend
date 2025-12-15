'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchForm() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        data-testid="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="記事を検索..."
        className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button
        type="submit"
        data-testid="search-button"
        className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        検索
      </button>
    </form>
  )
}
