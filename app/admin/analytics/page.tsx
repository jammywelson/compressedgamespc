'use client'
import { useState, useEffect } from 'react'
export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    Promise.all([fetch('/api/games?limit=10').then(r=>r.json()),fetch('/api/users').then(r=>r.json())])
      .then(([g,u])=>{
        setStats({total:g.total||0,users:u.length||0,downloads:g.games?.reduce((s:number,x:any)=>s+(x.downloadCount||0),0)||0,views:g.games?.reduce((s:number,x:any)=>s+(x.viewCount||0),0)||0,top:(g.games||[]).sort((a:any,b:any)=>b.downloadCount-a.downloadCount).slice(0,8)})
        setLoading(false)
      }).catch(()=>setLoading(false))
  },[])
  const Box=({l,v,c,i}:any)=>(
    <div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e2e8f0',flex:1,minWidth:'150px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><p style={{margin:0,fontSize:'13px',color:'#64748b',fontWeight:500}}>{l}</p><p style={{margin:'6px 0 0',fontSize:'28px',fontWeight:700,color:'#1e293b'}}>{loading?'...':v}</p></div>
        <div style={{width:'44px',height:'44px',borderRadius:'10px',background:c+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>{i}</div>
      </div>
    </div>
  )
  return (
    <div style={{padding:'20px'}}>
      <h1 style={{margin:'0 0 20px',fontSize:'22px',fontWeight:700}}>&#128200; Analytics</h1>
      <div style={{display:'flex',gap:'16px',flexWrap:'wrap',marginBottom:'24px'}}>
        <Box l="Total Games" v={stats.total} c="#6366f1" i="&#127918;" />
        <Box l="Total Users" v={stats.users} c="#3b82f6" i="&#128101;" />
        <Box l="Downloads" v={stats.downloads?.toLocaleString()} c="#10b981" i="&#128229;" />
        <Box l="Page Views" v={stats.views?.toLocaleString()} c="#f59e0b" i="&#128065;" />
      </div>
      <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'20px'}}>
        <h3 style={{margin:'0 0 16px',fontWeight:700}}>Top Downloaded Games</h3>
        {loading?<p style={{color:'#94a3b8'}}>Loading...</p>:
          (stats.top||[]).length===0?<p style={{color:'#94a3b8'}}>No games yet.</p>:
          (stats.top||[]).map((g:any,i:number)=>(
            <div key={g.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:'1px solid #f1f5f9'}}>
              <span style={{width:'24px',textAlign:'center',fontWeight:700,color:'#6366f1',fontSize:'13px'}}>{i+1}</span>
              <div style={{flex:1}}><p style={{margin:0,fontWeight:600,fontSize:'14px'}}>{g.title}</p><p style={{margin:'2px 0 0',fontSize:'12px',color:'#64748b'}}>{g.category} &#8226; {g.size}</p></div>
              <div style={{textAlign:'right'}}><p style={{margin:0,fontWeight:700,color:'#6366f1'}}>{(g.downloadCount||0).toLocaleString()}</p><p style={{margin:0,fontSize:'11px',color:'#94a3b8'}}>downloads</p></div>
            </div>
          ))
        }
      </div>
    </div>
  )
}