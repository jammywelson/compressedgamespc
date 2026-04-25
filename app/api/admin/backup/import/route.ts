import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export async function POST(req: NextRequest) {
  try {
    const backup = await req.json()
    let count = 0
    if (backup.settings?.length) {
      for (const s of backup.settings) {
        await prisma.setting.upsert({ where:{key:s.key}, update:{value:s.value}, create:{key:s.key,value:s.value} })
        count++
      }
    }
    if (backup.categories?.length) {
      for (const c of backup.categories) {
        await prisma.category.upsert({ where:{slug:c.slug}, update:c, create:c }).catch(()=>{})
        count++
      }
    }
    return NextResponse.json({ ok: true, count })
  } catch(e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}