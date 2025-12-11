import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * テスト用コメント作成API
 * POST /api/test/create-comment
 *
 * 注意: このAPIは開発・テスト環境でのみ使用すること
 */
export async function POST(request: Request) {
  // 本番環境では使用不可
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: { message: 'このAPIは本番環境では使用できません' } },
      { status: 403 }
    )
  }

  try {
    const { content, postId, authorId } = await request.json()

    // 必須パラメータチェック
    if (!content || !postId || !authorId) {
      return NextResponse.json(
        { error: { message: 'content, postId, authorId は必須です' } },
        { status: 400 }
      )
    }

    // コメントを作成
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
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
    console.error('Test comment creation error:', error)
    return NextResponse.json(
      { error: { message: 'コメントの作成に失敗しました' } },
      { status: 500 }
    )
  }
}
