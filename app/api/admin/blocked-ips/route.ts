import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  const ips = await prisma.blockedIp.findMany({ orderBy:{createdAt:'desc'} })
  return NextResponse.json(ips)
}
export async function POST(req: NextRequest) {
  const { ip, reason } = await req.json()
  try {
    const b = await prisma.blockedIp.create({ data:{ip,reason} })
    return NextResponse.json(b)
  } catch(e) { return NextResponse.json({error:String(e)},{status:500}) }
}