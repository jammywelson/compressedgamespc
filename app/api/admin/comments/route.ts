import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams
  const status = sp.get('status')||'', limit = parseInt(sp.get('limit')||'50')
  const where: any = {}; if (status) where.status = status
  const comments = await prisma.comment.findMany({ where, orderBy:{createdAt:'desc'}, take:limit, include:{game:{select:{title:true,slug:true}},user:{select:{username:true}}} })
  return NextResponse.json(comments)
}
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const c = await prisma.comment.update({ where:{id}, data:{status} })
  return NextResponse.json(c)
}
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await prisma.comment.delete({ where:{id} })
  return NextResponse.json({ ok: true })
}