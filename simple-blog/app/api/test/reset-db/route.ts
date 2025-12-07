import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * データベースリセットAPI
 * E2Eテスト用のエンドポイント
 *
 * 注意: 本番環境では無効化する必要があります
 */
export async function POST() {
  // 本番環境では実行しない
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  try {
    // トランザクションで全テーブルをクリーンアップ
    await prisma.$transaction([
      prisma.comment.deleteMany(),
      prisma.post.deleteMany(),
      prisma.session.deleteMany(),
      prisma.account.deleteMany(),
      prisma.verificationToken.deleteMany(),
      prisma.user.deleteMany(),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    )
  }
}
