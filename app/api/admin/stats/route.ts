import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const [games, users, comments, pendingComments, draftGames] = await Promise.all([
      prisma.game.count(),
      prisma.user.count(),
      prisma.comment.count(),
      prisma.comment.count({ where: { status: 'pending' } }),
      prisma.game.count({ where: { status: 'draft' } }),
    ])
    let downloads = 0
    try { const d = await prisma.download.count(); downloads = d } catch {}
    return NextResponse.json({ games, users, downloads, comments, pendingComments, draftGames })
  } catch { return NextResponse.json({ games:0, users:0, downloads:0, comments:0, pendingComments:0, draftGames:0 }) }
}