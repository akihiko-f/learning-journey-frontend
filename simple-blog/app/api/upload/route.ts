import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeFile } from 'fs/promises'
import path from 'path'

/**
 * 画像アップロードAPI
 * POST /api/upload
 */
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { message: 'ログインが必要です' } },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: { message: 'ファイルが選択されていません' } },
        { status: 400 }
      )
    }

    // ファイルタイプのバリデーション
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: { message: '対応していないファイル形式です（JPEG, PNG, GIF, WebPのみ）' } },
        { status: 400 }
      )
    }

    // ファイルサイズのバリデーション（5MB上限）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: { message: 'ファイルサイズは5MB以下にしてください' } },
        { status: 400 }
      )
    }

    // ユニークなファイル名を生成
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

    // ファイルを保存
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)

    // 公開URLを返す
    const url = `/uploads/${filename}`

    return NextResponse.json({
      success: true,
      url,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: { message: 'アップロードに失敗しました' } },
      { status: 500 }
    )
  }
}
