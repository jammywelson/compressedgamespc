import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const [games, categories, users, settings, comments] = await Promise.all([
      prisma.game.findMany(),
      prisma.category.findMany(),
      prisma.user.findMany({ select:{id:true,username:true,email:true,role:true,displayName:true,active:true,createdAt:true} }),
      prisma.setting.findMany(),
      prisma.comment.findMany(),
    ])
    const backup = { version:'1.0', exportedAt: new Date().toISOString(), games, categories, users, settings, comments }
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: { 'Content-Type':'application/json', 'Content-Disposition':'attachment; filename="cgpc-backup-'+new Date().toISOString().split('T')[0]+'.json"' }
    })
  } catch(e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}