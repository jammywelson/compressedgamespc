import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  const cats = await prisma.category.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json({ categories: cats })
}
export async function POST(req: NextRequest) {
  try {
    const { name, description, icon, color } = await req.json()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g,'-')
    const cat = await prisma.category.create({ data: { name, slug, description, icon, color } })
    return NextResponse.json({ category: cat })
  } catch(e:any) { return NextResponse.json({ error: 'Category exists or invalid data' }, { status: 400 }) }
}