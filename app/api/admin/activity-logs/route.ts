import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  const logs = await prisma.activityLog.findMany({ orderBy:{createdAt:'desc'}, take:100, include:{user:{select:{username:true}}} })
  return NextResponse.json(logs)
}