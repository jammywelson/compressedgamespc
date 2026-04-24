'use client'
import { useState, useEffect, useCallback } from 'react'

export default function StatsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7')
  const [live, setLive] = useState(0)

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/analytics?period=${period}`)
      const d = await r.json()
      setData(d); setLive(d.realtimeViews || 0)
    } catch(e) {}
    setLoading(false)
  }, [period])

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t) }, [load])

  return (
    <div style={{background:'#f0f2f8', minHeight:'100vh'}}>
      <div style={{background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:'54px', display:'flex', alignItems:'center', gap:'12px'}}>
        <span style={{fontSize:'18px', fontWeight:700, color:'#111827'}}>Site Analytics</span>
        <div style={{display:'flex', alignItems:'center', gap:'6px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'20px', padding:'4px 10px'}}>
          <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#16a34a', animation:'pulse 2s infinite'}}/>
          <span style={{fontSize:'12px', color:'#16a34a', fontWeight:600}}>{live} live</span>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        <div style={{display:'flex', gap:'4px', marginLeft:'auto'}}>
          {[['1','Today'],['7','7 Days'],['30','30 Days'],['90','3 Months']].map(([v,l])=>(
            <button key={v} onClick={()=>setPeriod(v)}
              style={{background:period===v?'#4f46e5':'#f3f4f6', color:period===v?'#fff':'#374151', border:'none', borderRadius:'6px', padding:'5px 10px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit', fontWeight:period===v?600:400}}>
              {l}
            </button>
          ))}
        </div>
        <button onClick={load} style={{background:'#f3f4f6', border:'none', borderRadius:'6px', padding:'6px 10px', fontSize:'13px', cursor:'pointer'}}>↻</button>
      </div>
      <div style={{padding:'20px'}}>
        {loading ? (
          <div style={{textAlign:'center' as any, padding:'60px', color:'#6b7280'}}>Loading...</div>
        ) : (
          <>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'12px', marginBottom:'20px'}}>
              {[
                {label:'Total Views', val:(data?.totalViews||0).toLocaleString(), color:'#4f46e5', bg:'#eef2ff', icon:'👁'},
                {label:`Views (${period}d)`, val:(data?.recentViews||0).toLocaleString(), color:'#0891b2', bg:'#ecfeff', icon:'📈'},
                {label:'Live (5min)', val:live, color:'#16a34a', bg:'#f0fdf4', icon:'🔴'},
                {label:'Avg/Day', val:Math.round((data?.recentViews||0)/parseInt(period)), color:'#ea580c', bg:'#fff7ed', icon:'📅'},
              ].map(s=>(
                <div key={s.label} style={{background:s.bg, border:`1px solid ${s.color}22`, borderRadius:'10px', padding:'16px'}}>
                  <div style={{fontSize:'24px', marginBottom:'4px'}}>{s.icon}</div>
                  <div style={{fontSize:'26px', fontWeight:700, color:s.color}}>{s.val}</div>
                  <div style={{fontSize:'12px', color:'#6b7280', marginTop:'2px'}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px'}}>
              <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px'}}>
                <div style={{fontSize:'14px', fontWeight:700, color:'#111827', marginBottom:'14px'}}>📊 Daily Views</div>
                {data?.dailyStats?.length > 0 ? (
                  <div style={{display:'flex', alignItems:'flex-end', gap:'3px', height:'100px'}}>
                    {data.dailyStats.map((d:any) => {
                      const max = Math.max(...data.dailyStats.map((x:any)=>x.views||0), 1)
                      const h = Math.max(4, Math.round(((d.views||0)/max)*90))
                      return (
                        <div key={d.date} style={{flex:1, display:'flex', flexDirection:'column' as any, alignItems:'center', gap:'2px'}}>
                          <div style={{fontSize:'8px', color:'#6b7280'}}>{d.views||0}</div>
                          <div style={{width:'100%', height:`${h}px`, background:'#4f46e5', borderRadius:'2px 2px 0 0'}}/>
                          <div style={{fontSize:'8px', color:'#9ca3af'}}>{d.date?.slice(5)}</div>
                        </div>
                      )
                    })}
                  </div>
                ) : <div style={{textAlign:'center' as any, color:'#9ca3af', padding:'20px', fontSize:'13px'}}>Visitors aane ke baad data show hoga</div>}
              </div>
              <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px'}}>
                <div style={{fontSize:'14px', fontWeight:700, color:'#111827', marginBottom:'12px'}}>🏆 Top Pages</div>
                {data?.topPages?.length > 0 ? (
                  <div style={{display:'flex', flexDirection:'column' as any, gap:'6px'}}>
                    {data.topPages.slice(0,8).map((p:any) => {
                      const max = data.topPages[0]?.views||1
                      const pct = Math.round((p.views/max)*100)
                      return (
                        <div key={p.page}>
                          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2px'}}>
                            <span style={{fontSize:'11px', color:'#374151', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as any, maxWidth:'160px'}}>{p.page||'/'}</span>
                            <span style={{fontSize:'11px', color:'#4f46e5', fontWeight:600}}>{p.views}</span>
                          </div>
                          <div style={{height:'4px', background:'#f3f4f6', borderRadius:'2px'}}>
                            <div style={{height:'100%', width:`${pct}%`, background:'#4f46e5', borderRadius:'2px'}}/>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : <div style={{textAlign:'center' as any, color:'#9ca3af', padding:'20px', fontSize:'13px'}}>Data collecting...</div>}
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
              <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px'}}>
                <div style={{fontSize:'14px', fontWeight:700, color:'#111827', marginBottom:'12px'}}>📱 Devices</div>
                {data?.deviceStats?.length > 0 ? data.deviceStats.map((d:any)=>{
                  const total = data.deviceStats.reduce((s:number,x:any)=>s+x.count,0)||1
                  const pct = Math.round((d.count/total)*100)
                  return (
                    <div key={d.device} style={{marginBottom:'8px'}}>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'3px'}}>
                        <span style={{fontSize:'12px', color:'#374151'}}>{d.device==='mobile'?'📱':'🖥'} {d.device}</span>
                        <span style={{fontSize:'12px', color:'#6b7280'}}>{pct}%</span>
                      </div>
                      <div style={{height:'6px', background:'#f3f4f6', borderRadius:'3px'}}>
                        <div style={{height:'100%', width:`${pct}%`, background:d.device==='mobile'?'#4f46e5':'#16a34a', borderRadius:'3px'}}/>
                      </div>
                    </div>
                  )
                }) : <div style={{textAlign:'center' as any, color:'#9ca3af', padding:'20px', fontSize:'13px'}}>Data collecting...</div>}
              </div>
              <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px'}}>
                <div style={{fontSize:'14px', fontWeight:700, color:'#111827', marginBottom:'12px'}}>🌐 Browsers</div>
                {data?.browserStats?.length > 0 ? data.browserStats.map((b:any)=>{
                  const total = data.browserStats.reduce((s:number,x:any)=>s+x.count,0)||1
                  const pct = Math.round((b.count/total)*100)
                  const colors: Record<string,string> = {Chrome:'#4f46e5',Firefox:'#ea580c',Safari:'#0891b2',Edge:'#16a34a',Other:'#6b7280'}
                  return (
                    <div key={b.browser} style={{marginBottom:'8px'}}>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'3px'}}>
                        <span style={{fontSize:'12px', color:'#374151'}}>{b.browser}</span>
                        <span style={{fontSize:'12px', color:'#6b7280'}}>{pct}% ({b.count})</span>
                      </div>
                      <div style={{height:'6px', background:'#f3f4f6', borderRadius:'3px'}}>
                        <div style={{height:'100%', width:`${pct}%`, background:colors[b.browser]||'#6b7280', borderRadius:'3px'}}/>
                      </div>
                    </div>
                  )
                }) : <div style={{textAlign:'center' as any, color:'#9ca3af', padding:'20px', fontSize:'13px'}}>Data collecting...</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
