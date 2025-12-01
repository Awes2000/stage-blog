import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const category = searchParams.get('category')

    if (id) {
      // Get single post with comments
      const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  role: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      })

      if (!post) {
        return NextResponse.json(
          { success: false, message: 'Post not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, post })
    }

    // Get all posts with optional category filter
    const where = category ? { category } : {}

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
        comments: true,
      },
      orderBy: [
        {
          customDate: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    })

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
