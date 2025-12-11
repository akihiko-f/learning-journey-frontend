import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * コメント削除API
 * DELETE /api/comments/[id]
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    // 認証チェック
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { message: 'ログインが必要です' } },
        { status: 401 }
      )
    }

    // コメントを取得
    const comment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      return NextResponse.json(
        { error: { message: 'コメントが見つかりません' } },
        { status: 404 }
      )
    }

    // 権限チェック（自分のコメントのみ削除可能）
    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: { message: 'このコメントを削除する権限がありません' } },
        { status: 403 }
      )
    }

    // コメントを削除
    await prisma.comment.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'コメントを削除しました',
    })
  } catch (error) {
    console.error('Comment deletion error:', error)
    return NextResponse.json(
      { error: { message: 'コメントの削除に失敗しました' } },
      { status: 500 }
    )
  }
}
