'use client'
import { useState, useEffect } from 'react'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>({ totalViews:0, totalVisitors:0, totalDownloads:0, topPages:[], devices:{}, countries:[] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics?admin=1').then(r=>r.json()).then(d=>setData(d)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const stat = (label:string, value:any, icon:string, color:string) => (
    <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', display:'flex', alignItems:'center', gap:'16px' }}>
      <div style={{ width:'52px', height:'52px', borderRadius:'12px', background:color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>{icon}</div>
      <div><div style={{ fontSize:'28px', fontWeight:700, color:'#0f172a', lineHeight:1 }}>{loading?'...':(typeof value==='number'?value.toLocaleString():value)}</div><div style={{ fontSize:'13px', color:'#64748b', marginTop:'4px' }}>{label}</div></div>
    </div>
  )

  return (
    <div>
      <h1 style={{ margin:'0 0 20px', fontSize:'22px', fontWeight:700, color:'#0f172a' }}>\ud83d\udcc8 Analytics</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px', marginBottom:'24px' }}>
        {stat('Page Views', data.totalViews, '\ud83d\udc41', '#4f46e5')}
        {stat('Visitors', data.totalVisitors, '\ud83d\udc65', '#059669')}
        {stat('Downloads', data.totalDownloads, '\ud83d\udce5', '#0891b2')}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)' }}>
          <h3 style={{ margin:'0 0 16px', fontSize:'15px', fontWeight:700 }}>Top Pages</h3>
          {loading?<div style={{ color:'#94a3b8' }}>Loading...</div>
          :data.topPages?.length===0?<div style={{ color:'#94a3b8', padding:'20px 0' }}>No data yet. Add games to start tracking.</div>
          :data.topPages?.map((p:any,i:number)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f1f5f9', fontSize:'13px' }}>
              <span style={{ color:'#374151' }}>{p.page}</span>
              <span style={{ color:'#64748b', fontWeight:600 }}>{p.views}</span>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,.08)' }}>
          <h3 style={{ margin:'0 0 16px', fontSize:'15px', fontWeight:700 }}>Countries</h3>
          {loading?<div style={{ color:'#94a3b8' }}>Loading...</div>
          :data.countries?.length===0?<div style={{ color:'#94a3b8', padding:'20px 0' }}>No data yet.</div>
          :data.countries?.map((c:any,i:number)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f1f5f9', fontSize:'13px' }}>
              <span style={{ color:'#374151' }}>{c.country||'Unknown'}</span>
              <span style={{ color:'#64748b', fontWeight:600 }}>{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}