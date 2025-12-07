'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { validatePostTitle } from '@/lib/validation'

export default function NewPostPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 未ログインの場合はログインページにリダイレクト
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // エラー時に該当フィールドにフォーカスを当てる
  useEffect(() => {
    if (focusedField) {
      const element = document.querySelector(
        `[data-testid="${focusedField}"]`
      ) as HTMLElement
      if (element) {
        element.focus()
      }
    }
  }, [focusedField])

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setFocusedField(null)
    setIsSubmitting(true)

    // クライアント側バリデーション
    const titleValidation = validatePostTitle(formData.title)
    if (!titleValidation.valid) {
      setError(titleValidation.error!)
      setFocusedField('title-input')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          status: isDraft ? 'DRAFT' : 'PUBLISHED',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error?.message || '記事の作成に失敗しました')
        setIsSubmitting(false)
        return
      }

      // 成功メッセージ表示
      if (isDraft) {
        setSuccess('下書きを保存しました')
        router.push('/dashboard')
      } else {
        setSuccess('記事を公開しました')
        router.push(`/posts/${data.post.id}`)
      }
    } catch (err) {
      setError('サーバーエラーが発生しました')
      setIsSubmitting(false)
    }
  }

  // ローディング中
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    )
  }

  // 未ログイン（リダイレクト中）
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            新規記事作成
          </h1>

          <form onSubmit={(e) => handleSubmit(e, false)} noValidate>
            {error && (
              <div
                data-testid="error-message"
                className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded"
                role="alert"
              >
                {error}
              </div>
            )}
            {success && (
              <div
                data-testid="success-message"
                className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded"
                role="alert"
              >
                {success}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="title-input"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                タイトル
              </label>
              <input
                id="title-input"
                data-testid="title-input"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="記事のタイトルを入力"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                aria-invalid={focusedField === 'title-input' ? 'true' : 'false'}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="content-editor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                本文（Markdown）
              </label>
              <textarea
                id="content-editor"
                data-testid="content-editor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-h-[300px]"
                placeholder="Markdownで記事を書きましょう..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                data-testid="save-draft-button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                下書き保存
              </button>
              <button
                type="submit"
                data-testid="publish-button"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                公開する
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
