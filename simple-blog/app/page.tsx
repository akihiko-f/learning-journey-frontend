import { auth } from '@/auth'
import Link from 'next/link'

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">SimpleBlog</h1>
              </div>
            </div>
            <div className="flex items-center">
              {session?.user ? (
                <button
                  data-testid="user-menu-button"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {session.user.name}
                </button>
              ) : (
                <div className="space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    新規登録
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            記事一覧
          </h2>
          <div data-testid="post-list" className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">記事はまだありません</p>
          </div>
        </div>
      </main>
    </div>
  )
}
