import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const NC = { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' }

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get('key')
  try {
    if (key) {
      const s = await prisma.setting.findUnique({ where: { key } })
      return NextResponse.json(s ? JSON.parse(s.value) : null, { headers: NC })
    }
    const all = await prisma.setting.findMany()
    const obj: Record<string,any> = {}
    all.forEach(s => { try { obj[s.key] = JSON.parse(s.value) } catch { obj[s.key] = s.value } })
    return NextResponse.json(obj, { headers: NC })
  } catch { return NextResponse.json(null, { headers: NC }) }
}

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json()
    await prisma.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    })
    return NextResponse.json({ ok: true }, { headers: NC })
  } catch(e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}