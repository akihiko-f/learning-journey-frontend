import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function getUserPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  return posts
}

export default async function DashboardPage() {
  const session = await auth()

  // 未ログインの場合はログインページにリダイレクト
  if (!session || !session.user?.id) {
    redirect('/login')
  }

  const posts = await getUserPosts(session.user.id)

  const publishedPosts = posts.filter((p) => p.status === 'PUBLISHED')
  const draftPosts = posts.filter((p) => p.status === 'DRAFT')

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <Link
            href="/posts/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            新規記事作成
          </Link>
        </div>

        {/* 下書き一覧 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            下書き ({draftPosts.length})
          </h2>
          {draftPosts.length === 0 ? (
            <p className="text-gray-500">下書きはありません</p>
          ) : (
            <div className="bg-white shadow rounded-lg divide-y">
              {draftPosts.map((post) => (
                <div
                  key={post.id}
                  data-testid={`draft-post-${post.id}`}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      更新日:{' '}
                      {new Date(post.updatedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      編集
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 公開済み一覧 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            公開済み ({publishedPosts.length})
          </h2>
          {publishedPosts.length === 0 ? (
            <p className="text-gray-500">公開済みの記事はありません</p>
          ) : (
            <div className="bg-white shadow rounded-lg divide-y">
              {publishedPosts.map((post) => (
                <div
                  key={post.id}
                  data-testid={`published-post-${post.id}`}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      公開日:{' '}
                      {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/posts/${post.id}`}
                      className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50"
                    >
                      表示
                    </Link>
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      編集
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
