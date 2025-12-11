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

interface CommentListProps {
  comments: Comment[]
  currentUserId?: string
  onCommentDeleted: (commentId: string) => void
}

export function CommentList({ comments, currentUserId, onCommentDeleted }: CommentListProps) {
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleDelete = async (commentId: string) => {
    setDeletingCommentId(commentId)

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onCommentDeleted(commentId)
      } else {
        const data = await response.json()
        alert(data.error?.message || 'コメントの削除に失敗しました')
      }
    } catch {
      alert('コメントの削除に失敗しました')
    } finally {
      setDeletingCommentId(null)
      setShowDeleteConfirm(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (comments.length === 0) {
    return (
      <div data-testid="comment-list" className="text-gray-500 text-center py-8">
        まだコメントはありません
      </div>
    )
  }

  return (
    <div data-testid="comment-list" className="space-y-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          data-testid={`comment-item-${comment.id}`}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              {comment.author.image ? (
                <img
                  src={comment.author.image}
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium mr-3">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span
                  data-testid={`comment-author-${comment.id}`}
                  className="font-medium text-gray-900"
                >
                  {comment.author.name}
                </span>
                <time
                  data-testid={`comment-date-${comment.id}`}
                  className="block text-sm text-gray-500"
                >
                  {formatDate(comment.createdAt)}
                </time>
              </div>
            </div>

            {/* 自分のコメントのみ削除ボタンを表示 */}
            {currentUserId === comment.author.id && (
              <button
                type="button"
                data-testid={`delete-comment-button-${comment.id}`}
                onClick={() => setShowDeleteConfirm(comment.id)}
                className="text-red-600 hover:text-red-800 text-sm"
                disabled={deletingCommentId === comment.id}
              >
                削除
              </button>
            )}
          </div>

          <p
            data-testid={`comment-content-${comment.id}`}
            className="text-gray-700 whitespace-pre-wrap"
          >
            {comment.content}
          </p>

          {/* 削除確認ダイアログ */}
          {showDeleteConfirm === comment.id && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 mb-4">このコメントを削除しますか？</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="confirm-delete-comment-button"
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingCommentId === comment.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingCommentId === comment.id ? '削除中...' : '削除する'}
                </button>
                <button
                  type="button"
                  data-testid="cancel-delete-comment-button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
