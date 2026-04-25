import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try { return NextResponse.json(await prisma.blockedIp.findMany({orderBy:{createdAt:'desc'}})) }
  catch { return NextResponse.json([]) }
}
export async function POST(req: NextRequest) {
  const { ip, reason } = await req.json()
  try { return NextResponse.json(await prisma.blockedIp.create({data:{ip,reason}})) }
  catch(e) { return NextResponse.json({error:String(e)},{status:500}) }
}