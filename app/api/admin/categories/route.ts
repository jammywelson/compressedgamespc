import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cats = await prisma.category.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(cats)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  try {
    const cat = await prisma.category.create({ data: { ...data, slug } })
    return NextResponse.json(cat)
  } catch(e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}