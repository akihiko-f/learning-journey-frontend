'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateName,
} from '@/lib/validation'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    name: '',
    password: '',
    passwordConfirm: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setFocusedField(null)

    // クライアント側バリデーション
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) {
      setError(emailValidation.error!)
      setFocusedField('email-input')
      return
    }

    const usernameValidation = validateUsername(formData.username)
    if (!usernameValidation.valid) {
      setError(usernameValidation.error!)
      setFocusedField('username-input')
      return
    }

    const nameValidation = validateName(formData.name)
    if (!nameValidation.valid) {
      setError(nameValidation.error!)
      setFocusedField('name-input')
      return
    }

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.error!)
      setFocusedField('password-input')
      return
    }

    // パスワード確認
    if (formData.password !== formData.passwordConfirm) {
      setError('パスワードが一致しません')
      setFocusedField('password-confirm-input')
      return
    }

    try {
      // ユーザー登録API呼び出し
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          name: formData.name,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // エラーハンドリング
        setError(data.error?.message || '登録に失敗しました')

        // エラーの種類に応じてフォーカスを設定
        if (data.error?.message?.includes('メールアドレス')) {
          setFocusedField('email-input')
        } else if (data.error?.message?.includes('パスワード')) {
          setFocusedField('password-input')
        } else if (data.error?.message?.includes('ユーザー名')) {
          setFocusedField('username-input')
        }
        return
      }

      // 成功メッセージ表示
      setSuccess('アカウントが作成されました')

      // 自動ログイン
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        // トップページにリダイレクト
        router.push('/')
      }
    } catch (err) {
      setError('サーバーエラーが発生しました')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウント登録
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {error && (
            <div
              data-testid="error-message"
              className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              data-testid="success-message"
              className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded"
              role="alert"
            >
              {success}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-input" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email-input"
                data-testid="email-input"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                aria-invalid={focusedField === 'email-input' ? 'true' : 'false'}
                autoFocus={focusedField === 'email-input'}
              />
            </div>
            <div>
              <label htmlFor="username-input" className="sr-only">
                ユーザー名
              </label>
              <input
                id="username-input"
                data-testid="username-input"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="ユーザー名"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="name-input" className="sr-only">
                表示名
              </label>
              <input
                id="name-input"
                data-testid="name-input"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="表示名"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">
                パスワード
              </label>
              <input
                id="password-input"
                data-testid="password-input"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード（8文字以上）"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                aria-invalid={
                  focusedField === 'password-input' ? 'true' : 'false'
                }
                autoFocus={focusedField === 'password-input'}
              />
            </div>
            <div>
              <label htmlFor="password-confirm-input" className="sr-only">
                パスワード（確認）
              </label>
              <input
                id="password-confirm-input"
                data-testid="password-confirm-input"
                name="password-confirm"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード（確認）"
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirm: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              data-testid="register-button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
