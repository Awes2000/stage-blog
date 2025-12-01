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
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 20px;
            }
            .footer { margin-top: 20px; font-size: 12px; color: #6b7280; }
            h1 { margin: 0; font-size: 24px; }
            h2 { color: #1f2937; margin-top: 0; }
            .info { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .automated { font-style: italic; color: #6b7280; font-size: 14px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 Nieuwe Stageblog Post</h1>
            </div>
            <div class="content">
              <p class="automated">🤖 Geautomatiseerd bericht - Een nieuwe blogpost is gecreëerd</p>

              <h2>${post.title}</h2>

              <div class="info">
                <p><strong>Categorie:</strong> ${post.category === 'stage1' ? 'Stage 1' : 'Stage 2'}</p>
                <p><strong>Datum:</strong> ${new Date(post.createdAt).toLocaleDateString('nl-NL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              <a href="${postUrl}" class="button">Bekijk hier de volledige post →</a>

              <div class="footer">
                <p>Dit is een geautomatiseerde notificatie van de Stageblog.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
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
