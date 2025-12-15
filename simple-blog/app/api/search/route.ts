import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 記事検索API
 * GET /api/search?q={keyword}&tag={tag}
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const tag = searchParams.get('tag')

    if (!query && !tag) {
      return NextResponse.json({ posts: [], total: 0 })
    }

    const whereCondition = {
      status: 'PUBLISHED' as const,
      AND: [
        // キーワード検索（タイトルまたは本文に含まれる）
        query
          ? {
              OR: [
                { title: { contains: query } },
                { content: { contains: query } },
              ],
            }
          : {},
        // タグフィルター
        tag
          ? {
              tags: {
                some: {
                  name: { contains: tag },
                },
              },
            }
          : {},
      ],
    }

    const posts = await prisma.post.findMany({
      where: whereCondition,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        tags: true,
      },
    })

    return NextResponse.json({
      posts,
      total: posts.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: { message: '検索に失敗しました' } },
      { status: 500 }
    )
  }
}
