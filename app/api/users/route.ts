import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy:{ createdAt:'desc' } })
    return NextResponse.json(users)
  } catch(e) { return NextResponse.json([]) }
}

export async function POST(req: NextRequest) {
  try {
    const d = await req.json()
    const user = await prisma.user.create({ data:{
      name:d.name, username:d.username, email:d.email,
      password:d.password, role:d.role||'editor',
      permissions:d.permissions||[], status:'active'
    }})
    return NextResponse.json(user)
  } catch(e:any) { return NextResponse.json({ error:e.message },{ status:500 }) }
}
