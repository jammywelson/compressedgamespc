import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const game = await prisma.game.findFirst({ where: { OR: [{id:params.id},{slug:params.id}] }, include:{author:{select:{username:true}},comments:true} })
  if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(game)
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  try {
    const game = await prisma.game.update({ where:{id:params.id}, data:{...data, downloadLinks: data.downloadLinks?JSON.stringify(data.downloadLinks):undefined, publishedAt: data.status==='published'?new Date():undefined, updatedAt:new Date()} })
    return NextResponse.json(game)
  } catch(e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.game.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch(e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}