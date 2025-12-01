import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function POST(request) {
  try {
    const user = await requireAdmin()

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, title, content, category, customDate } = await request.json()

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        category,
        customDate: customDate ? new Date(customDate) : null,
      },
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
