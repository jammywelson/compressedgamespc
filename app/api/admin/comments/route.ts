import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  const status = new URL(req.url).searchParams.get('status')||''
  const where:any={}; if(status) where.status=status
  return NextResponse.json(await prisma.comment.findMany({where,orderBy:{createdAt:'desc'},take:100,include:{game:{select:{title:true,slug:true}},user:{select:{username:true}}}}))
}
export async function PATCH(req: NextRequest) {
  const {id,status} = await req.json()
  return NextResponse.json(await prisma.comment.update({where:{id},data:{status}}))
}
export async function DELETE(req: NextRequest) {
  const {id} = await req.json()
  await prisma.comment.delete({where:{id}})
  return NextResponse.json({ok:true})
}