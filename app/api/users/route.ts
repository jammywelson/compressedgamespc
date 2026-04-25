import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

function hashPw(pw: string) {
  return crypto.createHash('sha256').update(pw + (process.env.PW_SALT || 'cgpc_salt_2024')).digest('hex')
}

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true, displayName: true, active: true, suspended: true, lastLoginAt: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  try {
    const user = await prisma.user.create({
      data: { ...data, password: hashPw(data.password), permissions: {} }
    })
    return NextResponse.json({ id: user.id, username: user.username, role: user.role })
  } catch(e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}