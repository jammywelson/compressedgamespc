import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return NextResponse.json(null, { status: 401 })
    const user = await prisma.user.findUnique({
      where: { id: token },
      select: { id:true, username:true, email:true, role:true, displayName:true, avatar:true, permissions:true, active:true, suspended:true }
    })
    if (!user || !user.active || user.suspended) return NextResponse.json(null, { status: 401 })
    return NextResponse.json(user)
  } catch { return NextResponse.json(null, { status: 500 }) }
}