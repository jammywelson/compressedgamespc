import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return NextResponse.json({ user: null })
    const [userId] = Buffer.from(token, 'base64').toString().split(':')
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id:true,name:true,username:true,email:true,role:true,permissions:true,avatar:true } })
    return NextResponse.json({ user })
  } catch { return NextResponse.json({ user: null }) }
}