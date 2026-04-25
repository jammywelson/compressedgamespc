import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  const token = cookies().get('admin_token')?.value
  if (!token) return NextResponse.json(null, { status: 401 })
  try {
    const user = await prisma.user.findUnique({ where: { id: token }, select: { id:true, username:true, email:true, role:true, displayName:true } })
    return NextResponse.json(user || null, { status: user ? 200 : 401 })
  } catch { return NextResponse.json(null, { status: 500 }) }
}