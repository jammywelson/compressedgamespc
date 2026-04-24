import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  try {
    if (key) {
      const s = await prisma.setting.findUnique({ where: { key } })
      return NextResponse.json(s ? JSON.parse(s.value) : null)
    }
    const all = await prisma.setting.findMany()
    const obj: Record<string,any> = {}
    all.forEach(s => { try { obj[s.key] = JSON.parse(s.value) } catch(e) { obj[s.key] = s.value } })
    return NextResponse.json(obj)
  } catch(e) { return NextResponse.json(null) }
}

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json()
    await prisma.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    })
    return NextResponse.json({ success: true })
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
