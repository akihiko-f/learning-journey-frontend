'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { use } from 'react'
import { validatePostTitle } from '@/lib/validation'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })
  const [originalStatus, setOriginalStatus] = useState<string>('DRAFT')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 記事データを取得
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) {
          setError('記事が見つかりません')
          return
        }
        const data = await response.json()
        setFormData({
          title: data.post.title,
          content: data.post.content,
        })
        setOriginalStatus(data.post.status)
      } catch (err) {
        setError('記事の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchPost()
    }
  }, [id, status])

  // 未ログインの場合はログインページにリダイレクト
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    // バリデーション
    const titleValidation = validatePostTitle(formData.title)
    if (!titleValidation.valid) {
      setError(titleValidation.error!)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error?.message || '記事の更新に失敗しました')
        setIsSubmitting(false)
        return
      }

      setSuccess('記事を更新しました')
      router.push(`/posts/${id}`)
    } catch (err) {
      setError('サーバーエラーが発生しました')
      setIsSubmitting(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">記事を編集</h1>

          <form onSubmit={handleSubmit} noValidate>
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
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                data-testid="save-button"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
