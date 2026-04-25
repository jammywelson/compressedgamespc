import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
    return NextResponse.json(media)
  } catch { return NextResponse.json([]) }
}