import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

function hashPw(pw: string) {
  return crypto.createHash('sha256').update(pw + (process.env.PW_SALT || 'cgpc2024')).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }], active: true, suspended: false }
    })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const valid = user.password === hashPw(password) || user.password === password
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    if (!['super_admin','admin','moderator','editor'].includes(user.role))
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date(), lastLoginIp: req.headers.get('x-forwarded-for') || '' } })
    await prisma.loginLog.create({ data: { userId: user.id, ip: req.headers.get('x-forwarded-for') || '', userAgent: req.headers.get('user-agent') || '', success: true } }).catch(() => {})
    const cookieStore = await cookies()
    cookieStore.set('admin_token', user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60*60*24*7, path: '/', sameSite: 'lax' })
    return NextResponse.json({ ok: true, role: user.role, username: user.username })
  } catch(e) {
    return NextResponse.json({ error: 'Server error: ' + String(e) }, { status: 500 })
  }
}