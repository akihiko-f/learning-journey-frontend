import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * テスト用: 記事を作成
 * POST /api/test/create-post
 */
export async function POST(request: Request) {
  // 本番環境では無効化
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  try {
    const { title, content, authorId, status = 'PUBLISHED', tags } = await request.json()

    if (!title || !authorId) {
      return NextResponse.json(
        { error: 'title and authorId are required' },
        { status: 400 }
      )
    }

    // タグを処理（存在しないタグは作成、存在するタグは接続）
    const tagConnections = tags && tags.length > 0
      ? {
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        }
      : undefined

    const post = await prisma.post.create({
      data: {
        title,
        content: content || '',
        excerpt: content ? content.substring(0, 100) : '',
        authorId,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: tagConnections,
      },
      include: {
        tags: true,
      },
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
