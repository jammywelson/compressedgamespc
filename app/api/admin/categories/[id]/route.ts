import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export async function PATCH(req: NextRequest, {params}:{params:{id:string}}) {
  const data = await req.json()
  return NextResponse.json(await prisma.category.update({where:{id:params.id},data}))
}
export async function DELETE(_req: NextRequest, {params}:{params:{id:string}}) {
  await prisma.category.delete({where:{id:params.id}})
  return NextResponse.json({ok:true})
}