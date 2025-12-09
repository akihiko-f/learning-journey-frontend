import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { validatePostTitle } from '@/lib/validation'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * 記事取得API
 * GET /api/posts/[id]
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: { message: '記事が見つかりません' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Post fetch error:', error)
    return NextResponse.json(
      { error: { message: '記事の取得に失敗しました' } },
      { status: 500 }
    )
  }
}

/**
 * 記事更新API
 * PUT /api/posts/[id]
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { message: 'ログインが必要です' } },
        { status: 401 }
      )
    }

    const { id } = await params
    const { title, content, status } = await request.json()

    // 記事の存在確認と所有者チェック
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: { message: '記事が見つかりません' } },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: { message: 'この記事を編集する権限がありません' } },
        { status: 403 }
      )
    }

    // タイトルバリデーション
    const titleValidation = validatePostTitle(title)
    if (!titleValidation.valid) {
      return NextResponse.json(
        { error: { message: titleValidation.error } },
        { status: 400 }
      )
    }

    // 抜粋を更新
    const excerpt = content ? content.substring(0, 100) : ''

    // 記事を更新
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content: content || '',
        excerpt,
        status: status || existingPost.status,
        publishedAt:
          status === 'PUBLISHED' && !existingPost.publishedAt
            ? new Date()
            : existingPost.publishedAt,
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
    console.error('Post update error:', error)
    return NextResponse.json(
      { error: { message: '記事の更新に失敗しました' } },
      { status: 500 }
    )
  }
}

/**
 * 記事削除API
 * DELETE /api/posts/[id]
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { message: 'ログインが必要です' } },
        { status: 401 }
      )
    }

    const { id } = await params

    // 記事の存在確認と所有者チェック
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: { message: '記事が見つかりません' } },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: { message: 'この記事を削除する権限がありません' } },
        { status: 403 }
      )
    }

    // 記事を削除
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Post delete error:', error)
    return NextResponse.json(
      { error: { message: '記事の削除に失敗しました' } },
      { status: 500 }
    )
  }
}
