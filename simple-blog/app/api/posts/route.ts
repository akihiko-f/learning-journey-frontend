import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { validatePostTitle } from '@/lib/validation'

/**
 * 記事作成API
 * POST /api/posts
 */
export async function POST(request: Request) {
  try {
    // 認証チェック
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { message: 'ログインが必要です' } },
        { status: 401 }
      )
    }

    const { title, content, status } = await request.json()

    // タイトルバリデーション
    const titleValidation = validatePostTitle(title)
    if (!titleValidation.valid) {
      return NextResponse.json(
        { error: { message: titleValidation.error } },
        { status: 400 }
      )
    }

    // 抜粋を生成（本文の最初の100文字）
    const excerpt = content ? content.substring(0, 100) : ''

    // 記事を作成
    const post = await prisma.post.create({
      data: {
        title,
        content: content || '',
        excerpt,
        status: status || 'DRAFT',
        authorId: session.user.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        status: post.status,
      },
    })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: { message: '記事の作成に失敗しました' } },
      { status: 500 }
    )
  }
}

/**
 * 記事一覧取得API
 * GET /api/posts
 */
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        publishedAt: 'desc',
      },
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

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Posts fetch error:', error)
    return NextResponse.json(
      { error: { message: '記事の取得に失敗しました' } },
      { status: 500 }
    )
  }
}
