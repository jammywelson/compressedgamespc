import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { page } = await req.json()
    const ua = req.headers.get('user-agent') || ''
    const device = /mobile|android|iphone/i.test(ua) ? 'mobile' : 'desktop'
    const browser = /chrome/i.test(ua) ? 'Chrome' : /firefox/i.test(ua) ? 'Firefox' : /safari/i.test(ua) ? 'Safari' : 'Other'
    await prisma.pageView.create({ data: { page, device, browser } })
    const today = new Date().toISOString().split('T')[0]
    await prisma.dailyStat.upsert({
      where: { date: today },
      update: { views: { increment: 1 } },
      create: { date: today, views: 1, visitors: 1 }
    })
    return NextResponse.json({ ok: true })
  } catch(e) { return NextResponse.json({ ok: false }) }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('period') || '7')
    const since = new Date(); since.setDate(since.getDate() - days)
    const [totalViews, recentViews, topPages, deviceStats, browserStats, dailyStats, realtimeViews] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: since } } }),
      prisma.pageView.groupBy({ by:['page'], _count:{page:true}, where:{createdAt:{gte:since}}, orderBy:{_count:{page:'desc'}}, take:10 }),
      prisma.pageView.groupBy({ by:['device'], _count:{device:true}, where:{createdAt:{gte:since}} }),
      prisma.pageView.groupBy({ by:['browser'], _count:{browser:true}, where:{createdAt:{gte:since}}, orderBy:{_count:{browser:'desc'}} }),
      prisma.dailyStat.findMany({ where:{date:{gte:since.toISOString().split('T')[0]}}, orderBy:{date:'asc'} }),
      prisma.pageView.count({ where:{createdAt:{gte:new Date(Date.now()-5*60*1000)}} })
    ])
    return NextResponse.json({
      totalViews, recentViews, realtimeViews,
      topPages: topPages.map(p=>({page:p.page, views:p._count.page})),
      deviceStats: deviceStats.map(d=>({device:d.device||'unknown', count:d._count.device})),
      browserStats: browserStats.map(b=>({browser:b.browser||'unknown', count:b._count.browser})),
      dailyStats,
    })
  } catch(e:any) { return NextResponse.json({ error: e.message }, { status:500 }) }
}
