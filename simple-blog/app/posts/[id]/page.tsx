import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'

interface PostPageProps {
  params: Promise<{ id: string }>
}

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  })

  return post
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  // 下書きの場合は404（TODO: 作者本人は見れるようにする）
  if (post.status === 'DRAFT') {
    notFound()
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div
      data-testid="post-detail-page"
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <article className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
        <header className="mb-8">
          <h1
            data-testid="post-title"
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600">
            <span data-testid="post-author" className="mr-4">
              {post.author.name}
            </span>
            <time data-testid="post-date" dateTime={post.publishedAt?.toISOString()}>
              {formattedDate}
            </time>
          </div>
        </header>

        <div
          data-testid="post-content"
          className="prose prose-lg max-w-none"
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
