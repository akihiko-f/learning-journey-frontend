'use client'

import { useState } from 'react'

interface Author {
  id: string
  name: string
  username: string
  image: string | null
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: Author
}

interface CommentFormProps {
  postId: string
  onCommentAdded: (comment: Comment) => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // クライアント側バリデーション
    if (!content.trim()) {
      setError('コメントを入力してください')
      return
    }

    if (content.length > 1000) {
      setError('コメントは1,000文字以内で入力してください')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: content.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onCommentAdded(data.comment)
        setContent('')
      } else {
        setError(data.error?.message || 'コメントの投稿に失敗しました')
      }
    } catch {
      setError('コメントの投稿に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8" data-testid="comment-form">
      <div className="mb-4">
        <label htmlFor="comment-input" className="sr-only">
          コメント
        </label>
        <textarea
          id="comment-input"
          data-testid="comment-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="コメントを入力..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-500">
            {content.length} / 1,000文字
          </span>
        </div>
      </div>

      {error && (
        <p data-testid="error-message" className="text-red-600 text-sm mb-4">
          {error}
        </p>
      )}

      <button
        type="submit"
        data-testid="comment-submit-button"
        disabled={isSubmitting}
        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '投稿中...' : 'コメントを投稿'}
      </button>
    </form>
  )
}
