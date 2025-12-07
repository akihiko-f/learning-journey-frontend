import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * テストユーザー作成API
 * E2Eテスト用のエンドポイント
 *
 * 注意: 本番環境では無効化する必要があります
 */
export async function POST(request: Request) {
  // 本番環境では実行しない
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  try {
    const { email, username, name, password } = await request.json()

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      userId: user.id
    })
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
