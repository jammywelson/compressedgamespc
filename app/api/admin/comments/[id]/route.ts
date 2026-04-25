import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  const comment = await prisma.comment.update({ where: { id: params.id }, data })
  return NextResponse.json({ comment })
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.comment.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}