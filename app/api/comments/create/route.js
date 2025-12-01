import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(request) {
  try {
    const user = await requireAuth()

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only teachers can comment
    if (user.role !== 'teacher') {
      return NextResponse.json(
        { success: false, message: 'Only teachers can comment' },
        { status: 403 }
      )
    }

    const { postId, content } = await request.json()

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
