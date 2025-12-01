import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import nodemailer from 'nodemailer'

async function sendNotificationEmail(post, teacherEmail) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const postUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/posts/${post.id}`

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: teacherEmail,
      subject: `Nieuwe Stageblog Post — ${post.title}`,
      html: `
        <h2>Nieuwe Stageblog Post</h2>
        <h3>${post.title}</h3>
        <p><strong>Categorie:</strong> ${post.category === 'stage1' ? 'Stage 1' : 'Stage 2'}</p>
        <p><strong>Datum:</strong> ${new Date(post.createdAt).toLocaleDateString('nl-NL')}</p>
        <p><a href="${postUrl}">Bekijk de post</a></p>
      `,
    })
  } catch (error) {
    console.error('Email notification error:', error)
  }
}

export async function POST(request) {
  try {
    const user = await requireAdmin()

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, content, category, customDate } = await request.json()

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        customDate: customDate ? new Date(customDate) : null,
        authorId: user.id,
      },
    })

    // Check if notifications are enabled
    const settings = await prisma.settings.findFirst()

    if (settings && settings.notificationsOn && settings.teacherEmail) {
      await sendNotificationEmail(post, settings.teacherEmail)
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
