import { auth } from '@/auth'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { slugifyTagName } from '@/lib/utils'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; tag?: string }>
}

async function searchPosts(query: string, tag?: string) {
  const whereCondition = {
    status: 'PUBLISHED' as const,
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query } },
              { content: { contains: query } },
            ],
          }
        : {},
      tag
        ? {
            tags: {
              some: {
                name: { contains: tag },
              },
            },
          }
        : {},
    ],
  }

  const posts = await prisma.post.findMany({
    where: whereCondition,
    orderBy: { publishedAt: 'desc' },
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
  })

  return posts
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const session = await auth()
  const { q: query, tag } = await searchParams

  const posts = query || tag ? await searchPosts(query || '', tag) : []

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // 検索キーワードをハイライトする関数
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text
    const regex = new RegExp(`(${keyword})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
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
            検索結果
            {query && <span className="text-lg font-normal text-gray-600 ml-2">「{query}」</span>}
          </h2>

          {/* フィルターバッジ */}
          {tag && (
            <div className="mb-6 flex items-center gap-2">
              <span
                data-testid="tag-filter-badge"
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
              >
                タグ: {tag}
                <Link
                  href={query ? `/search?q=${query}` : '/search'}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                  aria-label="タグフィルターを解除"
                >
                  ×
                </Link>
              </span>
            </div>
          )}

          <div data-testid="search-results" className="space-y-6">
            {!query && !tag ? (
              <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500">検索キーワードを入力してください</p>
              </div>
            ) : posts.length === 0 ? (
              <div data-testid="empty-state" className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500">該当する記事が見つかりませんでした</p>
              </div>
            ) : (
              posts.map((post, index) => (
                <article
                  key={post.id}
                  data-testid={`search-result-${index + 1}`}
                  className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link href={`/posts/${post.id}`} className="block p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {post.coverImage && (
                        <div className="md:w-48 flex-shrink-0">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3
                          className="text-xl font-semibold text-gray-900 mb-2"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(post.title, query || ''),
                          }}
                        />
                        <p
                          className="text-gray-600 mb-3 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(
                              post.excerpt || post.content.substring(0, 100),
                              query || ''
                            ),
                          }}
                        />
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{post.author.name}</span>
                          <span className="mx-2">·</span>
                          <time>{formatDate(post.publishedAt)}</time>
                        </div>
                        {post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {post.tags.map((tagItem) => (
                              <Link
                                key={tagItem.id}
                                href={`/search?q=${query || ''}&tag=${slugifyTagName(tagItem.name)}`}
                                data-testid={`tag-filter-${slugifyTagName(tagItem.name)}`}
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
        </div>
      </main>
    </div>
  )
}
