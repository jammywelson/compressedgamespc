import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
export const dynamic = 'force-dynamic'
export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id:true,name:true,username:true,email:true,role:true,active:true,createdAt:true,lastLogin:true } })
  return NextResponse.json({ users })
}
export async function POST(req: NextRequest) {
  try {
    const { name,username,email,password,role } = await req.json()
    const hashed = await bcrypt.hash(password, 10)
    const uname = username || email.split('@')[0]
    const user = await prisma.user.create({ data: { name,username:uname,email,password:hashed,role:role||'editor' } })
    return NextResponse.json({ user })
  } catch(e:any) {
    return NextResponse.json({ error: e.message?.includes('Unique') ? 'Email or username already exists' : 'Failed to create user' }, { status: 400 })
  }
}