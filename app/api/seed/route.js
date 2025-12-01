import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    // Security check - only allow in development or with secret key
    const { secret } = await request.json()

    if (process.env.NODE_ENV === 'production' && secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Start seeding...')

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin123!', 10)
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: adminPassword,
        role: 'admin',
      },
    })
    console.log('Created admin user:', admin.username)

    // Create teacher user: Paul
    const paulPassword = await bcrypt.hash('Paul123!', 10)
    const paul = await prisma.user.upsert({
      where: { username: 'Paul' },
      update: {},
      create: {
        username: 'Paul',
        password: paulPassword,
        role: 'teacher',
      },
    })
    console.log('Created teacher user:', paul.username)

    // Create default settings
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        notificationsOn: false,
        teacherEmail: '',
      },
    })
    console.log('Created default settings')

    // Create sample posts
    const existingPosts = await prisma.post.count()

    if (existingPosts === 0) {
      await prisma.post.create({
        data: {
          title: 'Welkom bij mijn Stage Blog',
          content: `# Welkom!

Dit is mijn eerste post op mijn stage blog. Hier zal ik mijn ervaringen en ontwikkelingen tijdens mijn stage delen.

## Wat ga je hier vinden?

- Reflecties op mijn werk
- Technische uitdagingen en oplossingen
- Persoonlijke ontwikkeling
- En nog veel meer!

Ik kijk ernaar uit om mijn reis met jullie te delen.`,
          category: 'stage1',
          authorId: admin.id,
          customDate: new Date('2024-01-15'),
        },
      })

      await prisma.post.create({
        data: {
          title: 'Week 1: Introductie en Oriëntatie',
          content: `# Week 1: Introductie en Oriëntatie

Deze week ben ik begonnen met mijn stage. Het was een spannende eerste week vol nieuwe indrukken.

## Wat heb ik gedaan?

- Kennismaking met het team
- Rondleiding door het bedrijf
- Eerste kleine opdrachten uitgevoerd
- Development environment opgezet

## Reflectie

Het team is erg vriendelijk en behulpzaam. Ik voel me al snel welkom en kijk uit naar de komende weken.

**Leerdoelen voor volgende week:**
- Meer verdieping in de codebase
- Eerste echte feature implementeren`,
          category: 'stage1',
          authorId: admin.id,
          customDate: new Date('2024-01-22'),
        },
      })

      await prisma.post.create({
        data: {
          title: 'Start Stage 2: Nieuwe Uitdagingen',
          content: `# Start Stage 2

Vandaag begin ik met het tweede deel van mijn stage. Ik heb al veel geleerd in Stage 1 en ben klaar voor nieuwe uitdagingen.

## Doelen voor Stage 2

1. **Technische vaardigheden**: Verder ontwikkelen van mijn programmeervaardigheden
2. **Samenwerking**: Meer samenwerken met andere teams
3. **Zelfstandigheid**: Grotere projecten zelfstandig aanpakken

Laten we beginnen! 🚀`,
          category: 'stage2',
          authorId: admin.id,
          customDate: new Date('2024-03-01'),
        },
      })
      console.log('Created sample posts')
    }

    console.log('Seeding finished.')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      users: [
        { username: admin.username, role: admin.role },
        { username: paul.username, role: paul.role },
      ],
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, message: 'Seeding failed', error: error.message },
      { status: 500 }
    )
  }
}
