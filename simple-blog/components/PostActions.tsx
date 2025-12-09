'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PostActionsProps {
  postId: string
  authorId: string
  currentUserId?: string
}

export function PostActions({ postId, authorId, currentUserId }: PostActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // 作者本人でない場合は何も表示しない
  if (currentUserId !== authorId) {
    return null
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const data = await response.json()
        alert(data.error?.message || '削除に失敗しました')
      }
    } catch (error) {
      alert('削除に失敗しました')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Link
          href={`/posts/${postId}/edit`}
          data-testid="edit-button"
          className="px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50"
        >
          編集
        </Link>
        <button
          data-testid="delete-button"
          onClick={() => setShowDeleteDialog(true)}
          className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          削除
        </button>
      </div>

      {/* 削除確認ダイアログ */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">記事を削除しますか？</h3>
            <p className="text-gray-600 mb-6">
              この操作は取り消せません。本当に削除しますか？
            </p>
            <div className="flex justify-end gap-2">
              <button
                data-testid="cancel-delete-button"
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                data-testid="confirm-delete-button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
