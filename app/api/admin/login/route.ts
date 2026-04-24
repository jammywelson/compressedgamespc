import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin'
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || 'cgpc2025'

    if (username === adminUser && password === adminPass) {
      const res = NextResponse.json({ success: true })
      res.cookies.set('cgpc_admin_auth', 'true', { path:'/', maxAge:86400 })
      res.cookies.set('cgpc_admin_user', username, { path:'/', maxAge:86400 })
      res.cookies.set('cgpc_admin_role', 'superadmin', { path:'/', maxAge:86400 })
      return res
    }

    const user = await prisma.user.findFirst({
      where: { OR:[{ username },{ email:username }], password, status:'active' }
    })

    if (user && ['admin','editor','moderator','manager'].includes(user.role)) {
      const res = NextResponse.json({ success: true })
      res.cookies.set('cgpc_admin_auth', 'true', { path:'/', maxAge:86400 })
      res.cookies.set('cgpc_admin_user', user.username, { path:'/', maxAge:86400 })
      res.cookies.set('cgpc_admin_role', user.role, { path:'/', maxAge:86400 })
      return res
    }

    return NextResponse.json({ error: 'Galat username ya password' }, { status:401 })
  } catch(e:any) {
    return NextResponse.json({ error: e.message }, { status:500 })
  }
}
