import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export async function GET(_req: NextRequest, {params}:{params:{id:string}}) {
  const g = await prisma.game.findUnique({where:{id:params.id}})
  return NextResponse.json(g)
}
export async function PATCH(req: NextRequest, {params}:{params:{id:string}}) {
  const data = await req.json()
  const g = await prisma.game.update({where:{id:params.id},data:{...data,updatedAt:new Date()}})
  return NextResponse.json(g)
}
export async function DELETE(_req: NextRequest, {params}:{params:{id:string}}) {
  await prisma.game.delete({where:{id:params.id}})
  return NextResponse.json({ok:true})
}