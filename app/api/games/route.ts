import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const category = searchParams.get('category') || ''
  const skip = (page - 1) * limit

  const where: any = {}
  if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }]
  if (status) where.status = status
  if (category) where.category = category

  const [games, total] = await Promise.all([
    prisma.game.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { author: { select: { username: true } } } }),
    prisma.game.count({ where })
  ])
  return NextResponse.json({ games, total, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  try {
    const game = await prisma.game.create({
      data: { ...data, slug, downloadLinks: JSON.stringify(data.downloadLinks || []), publishedAt: data.status === 'published' ? new Date() : null }
    })
    return NextResponse.json(game)
  } catch(e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}