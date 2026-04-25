import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    let count = 0
    if (data.settings) {
      for (const s of data.settings) {
        await prisma.setting.upsert({ where:{key:s.key}, update:{value:s.value}, create:{key:s.key,value:s.value} })
        count++
      }
    }
    if (data.categories) {
      for (const c of data.categories) {
        await prisma.category.upsert({ where:{slug:c.slug}, update:{name:c.name,description:c.description,icon:c.icon,color:c.color,order:c.order||0}, create:{name:c.name,slug:c.slug,description:c.description,icon:c.icon,color:c.color,order:c.order||0} })
        count++
      }
    }
    return NextResponse.json({ ok:true, count })
  } catch(e) { return NextResponse.json({error:String(e)},{status:500}) }
}