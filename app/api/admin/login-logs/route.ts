import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  const logs = await prisma.loginLog.findMany({ orderBy:{createdAt:'desc'}, take:50, include:{user:{select:{username:true}}} })
  return NextResponse.json(logs)
}