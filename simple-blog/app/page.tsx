import { auth } from '@/auth'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Pagination } from '@/components/Pagination'

const POSTS_PER_PAGE = 10

interface HomeProps {
  searchParams: Promise<{ page?: string }>
}

async function getPosts(page: number) {
  const skip = (page - 1) * POSTS_PER_PAGE

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: POSTS_PER_PAGE,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        tags: true,
      },
    }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
  ])

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  return { posts, totalCount, totalPages }
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await auth()
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  const { posts, totalPages } = await getPosts(currentPage)

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold">SimpleBlog</Link>
              </div>
            </div>
            <div className="flex items-center">
              {session?.user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/posts/new"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    記事を書く
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ダッシュボード
                  </Link>
                  <button
                    data-testid="user-menu-button"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {session.user.name}
                  </button>
                </div>
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

          <div data-testid="post-list" className="space-y-6">
            {posts.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500">記事はまだありません</p>
              </div>
            ) : (
              posts.map((post, index) => (
                <article
                  key={post.id}
                  data-testid={`post-card-${index + 1}`}
                  className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link href={`/posts/${post.id}`} className="block p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {post.coverImage && (
                        <div className="md:w-48 flex-shrink-0">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            data-testid={`post-cover-${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3
                          data-testid={`post-title-${index + 1}`}
                          className="text-xl font-semibold text-gray-900 mb-2"
                        >
                          {post.title}
                        </h3>
                        <p
                          data-testid={`post-excerpt-${index + 1}`}
                          className="text-gray-600 mb-3 line-clamp-2"
                        >
                          {post.excerpt || post.content.substring(0, 100)}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span data-testid={`post-author-${index + 1}`}>
                            {post.author.name}
                          </span>
                          <span className="mx-2">·</span>
                          <time data-testid={`post-date-${index + 1}`}>
                            {formatDate(post.publishedAt)}
                          </time>
                        </div>
                        {post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-block px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))
            )}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/"
            />
          )}
        </div>
      </main>
    </div>
  )
}
