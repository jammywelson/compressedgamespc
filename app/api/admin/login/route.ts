import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

function hashPw(pw: string) {
  return crypto.createHash('sha256').update(pw + process.env.PW_SALT || 'cgpc_salt_2024').digest('hex')
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }], active: true, suspended: false }
    })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    
    // Support both hashed and plain for migration
    const valid = user.password === hashPw(password) || user.password === password
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    
    // Check admin/mod role
    if (!['super_admin','admin','moderator','editor'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: req.headers.get('x-forwarded-for') || '' }
    })
    
    // Log login
    await prisma.loginLog.create({
      data: { userId: user.id, ip: req.headers.get('x-forwarded-for') || '', userAgent: req.headers.get('user-agent') || '', success: true }
    }).catch(() => {})

    const cookieStore = cookies()
    cookieStore.set('admin_token', user.id, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax'
    })
    
    return NextResponse.json({ ok: true, role: user.role, username: user.username })
  } catch(e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}