import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateName,
} from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, username, name } = body

    // バリデーション
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: emailValidation.error,
          },
        },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: passwordValidation.error,
          },
        },
        { status: 400 }
      )
    }

    const usernameValidation = validateUsername(username)
    if (!usernameValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: usernameValidation.error,
          },
        },
        { status: 400 }
      )
    }

    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: nameValidation.error,
          },
        },
        { status: 400 }
      )
    }

    // メールアドレスとユーザー名の重複チェック
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'CONFLICT',
              message: 'このメールアドレスは既に登録されています',
            },
          },
          { status: 409 }
        )
      } else {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'CONFLICT',
              message: 'このユーザー名は既に使用されています',
            },
          },
          { status: 409 }
        )
      }
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          user,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'サーバーエラーが発生しました',
        },
      },
      { status: 500 }
    )
  }
}
