import { auth } from '@/auth'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Pagination } from '@/components/Pagination'
import { slugifyTagName } from '@/lib/utils'

const POSTS_PER_PAGE = 10

interface PostsPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>
}

async function getPosts(page: number, tagSlug?: string) {
  const skip = (page - 1) * POSTS_PER_PAGE

  // タグ名を取得（スラッグから）
  let tagName: string | undefined
  if (tagSlug) {
    const tag = await prisma.tag.findFirst({
      where: {
        name: {
          contains: tagSlug,
        },
      },
    })
    tagName = tag?.name
  }

  const whereCondition = {
    status: 'PUBLISHED' as const,
    ...(tagName && {
      tags: {
        some: {
          name: tagName,
        },
      },
    }),
  }

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: whereCondition,
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
    prisma.post.count({ where: whereCondition }),
  ])

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  return { posts, totalCount, totalPages, tagName }
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const session = await auth()
  const { page, tag } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  const { posts, totalPages, tagName } = await getPosts(currentPage, tag)

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const basePath = tag ? `/posts?tag=${tag}` : '/posts'

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              記事一覧
            </h2>
          </div>

          {/* タグフィルターバッジ */}
          {tagName && (
            <div className="mb-6 flex items-center gap-2">
              <span
                data-testid="tag-filter-badge"
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
              >
                タグ: {tagName}
                <Link
                  href="/posts"
                  data-testid="clear-tag-filter"
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                  aria-label="フィルターを解除"
                >
                  ×
                </Link>
              </span>
            </div>
          )}

          <div data-testid="post-list" className="space-y-6">
            {posts.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500">
                  {tagName ? `「${tagName}」タグの記事はありません` : '記事はまだありません'}
                </p>
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
                            {post.tags.map((tagItem) => (
                              <Link
                                key={tagItem.id}
                                href={`/posts?tag=${slugifyTagName(tagItem.name)}`}
                                data-testid={`post-tag-${slugifyTagName(tagItem.name)}`}
                                className="inline-block px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                              >
                                {tagItem.name}
                              </Link>
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
              basePath={basePath}
            />
          )}
        </div>
      </main>
    </div>
  )
}
