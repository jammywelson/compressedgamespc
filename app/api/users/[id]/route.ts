import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }:{ params:{ id:string } }) {
  try {
    await prisma.user.delete({ where:{ id:params.id } })
    return NextResponse.json({ success:true })
  } catch(e:any) { return NextResponse.json({ error:e.message },{ status:500 }) }
}

export async function PATCH(req: NextRequest, { params }:{ params:{ id:string } }) {
  try {
    const d = await req.json()
    const user = await prisma.user.update({ where:{ id:params.id }, data:d })
    return NextResponse.json(user)
  } catch(e:any) { return NextResponse.json({ error:e.message },{ status:500 }) }
}
