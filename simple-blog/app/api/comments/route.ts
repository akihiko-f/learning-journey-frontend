import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * コメント投稿API
 * POST /api/comments
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

    const { postId, content } = await request.json()

    // コメント内容バリデーション
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: { message: 'コメントを入力してください' } },
        { status: 400 }
      )
    }

    // コメント最大文字数チェック（1000文字）
    if (content.length > 1000) {
      return NextResponse.json(
        { error: { message: 'コメントは1,000文字以内で入力してください' } },
        { status: 400 }
      )
    }

    // 記事の存在チェック
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: { message: '記事が見つかりません' } },
        { status: 404 }
      )
    }

    // コメントを作成
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: session.user.id,
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

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: { message: 'コメントの投稿に失敗しました' } },
      { status: 500 }
    )
  }
}

/**
 * コメント一覧取得API
 * GET /api/comments?postId={postId}
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: { message: '記事IDが必要です' } },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
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

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json(
      { error: { message: 'コメントの取得に失敗しました' } },
      { status: 500 }
    )
  }
}
