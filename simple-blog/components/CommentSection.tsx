'use client'

import { useState, useEffect } from 'react'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'

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

interface CommentSectionProps {
  postId: string
  currentUserId?: string
  isLoggedIn: boolean
}

export function CommentSection({ postId, currentUserId, isLoggedIn }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // コメント一覧を取得
  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/comments?postId=${postId}`)
      const data = await response.json()

      if (response.ok) {
        setComments(data.comments)
      } else {
        setError(data.error?.message || 'コメントの取得に失敗しました')
      }
    } catch {
      setError('コメントの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  // コメント投稿後のコールバック
  const handleCommentAdded = (newComment: Comment) => {
    setComments([...comments, newComment])
  }

  // コメント削除後のコールバック
  const handleCommentDeleted = (commentId: string) => {
    setComments(comments.filter((comment) => comment.id !== commentId))
  }

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        コメント ({comments.length})
      </h2>

      {/* コメントフォーム */}
      {isLoggedIn ? (
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600 mb-2">コメントするにはログインしてください</p>
          <a
            href="/login"
            data-testid="login-prompt-button"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            ログイン
          </a>
        </div>
      )}

      {/* コメント一覧 */}
      {isLoading ? (
        <div className="text-gray-500">コメントを読み込み中...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <CommentList
          comments={comments}
          currentUserId={currentUserId}
          onCommentDeleted={handleCommentDeleted}
        />
      )}
    </section>
  )
}
