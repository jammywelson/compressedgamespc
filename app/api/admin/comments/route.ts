import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  const status = new URL(req.url).searchParams.get('status')
  const where = status && status !== 'all' ? { status } : {}
  const comments = await prisma.comment.findMany({ where, orderBy: { createdAt: 'desc' }, include: { game: { select: { title:true,slug:true } } } })
  return NextResponse.json({ comments })
}