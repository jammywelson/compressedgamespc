import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.game.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const game = await prisma.game.update({ where: { id: params.id }, data })
    return NextResponse.json(game)
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
