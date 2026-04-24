import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const status   = searchParams.get('status')
    const search   = searchParams.get('q')

    const where: any = {}
    if (category && category !== 'All') where.category = category
    if (status)   where.status = status
    if (search)   where.title  = { contains: search, mode: 'insensitive' }

    const games = await prisma.game.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(games)
  } catch(e) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const game = await prisma.game.create({ data })
    return NextResponse.json(game)
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
