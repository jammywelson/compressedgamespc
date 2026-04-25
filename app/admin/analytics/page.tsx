'use client'
import { useState, useEffect } from 'react'
export default function AnalyticsPage() {
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    Promise.all([fetch('/api/games?limit=10').then(r=>r.json()),fetch('/api/users').then(r=>r.json())])
      .then(([games,users])=>{setData({total:games.total||0,users:users.length||0,downloads:games.games?.reduce((s:number,g:any)=>s+(g.downloadCount||0),0)||0,views:games.games?.reduce((s:number,g:any)=>s+(g.viewCount||0),0)||0,topGames:(games.games||[]).sort((a:any,b:any)=>b.downloadCount-a.downloadCount)});setLoading(false)})
      .catch(()=>setLoading(false))
  },[])
  const Stat=({icon,label,value,color}:any)=>(<div style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e2e8f0',flex:1,minWidth:'160px'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
      <div><p style={{margin:0,fontSize:'13px',color:'#64748b',fontWeight:500}}>{label}</p><p style={{margin:'6px 0 0',fontSize:'28px',fontWeight:800,color:'#0f172a'}}>{loading?'...':value}</p></div>
      <div style={{width:'46px',height:'46px',borderRadius:'12px',background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>{icon}</div>
    </div>
  </div>)
  return(
    <div style={{padding:'24px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <h1 style={{margin:'0 0 24px',fontSize:'22px',fontWeight:800}}>\u{1F4C8} Analytics</h1>
      <div style={{display:'flex',gap:'16px',flexWrap:'wrap',marginBottom:'24px'}}>
        <Stat icon="\u{1F3AE}" label="Total Games" value={data.total} color="#6366f1" />
        <Stat icon="\u{1F465}" label="Total Users" value={data.users} color="#3b82f6" />
        <Stat icon="\u{1F4E5}" label="Total Downloads" value={(data.downloads||0).toLocaleString()} color="#10b981" />
        <Stat icon="\u{1F441}\uFE0F" label="Total Views" value={(data.views||0).toLocaleString()} color="#f59e0b" />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
        <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'20px'}}>
          <h3 style={{margin:'0 0 16px',fontWeight:700}}>Top Downloaded Games</h3>
          {loading?<p style={{color:'#94a3b8'}}>Loading...</p>:
            (data.topGames||[]).map((g:any,i:number)=>(
              <div key={g.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'8px 0',borderBottom:'1px solid #f8fafc'}}>
                <div style={{width:'26px',height:'26px',borderRadius:'50%',background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'12px',color:'#6366f1',flexShrink:0}}>#{i+1}</div>
                {g.coverImage&&<img src={g.coverImage} style={{width:'36px',height:'36px',borderRadius:'6px',objectFit:'cover',flexShrink:0}} alt="" />}
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontWeight:600,fontSize:'13px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{g.title}</p>
                  <p style={{margin:'1px 0 0',fontSize:'11px',color:'#94a3b8'}}>{g.category}</p>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <p style={{margin:0,fontWeight:800,fontSize:'14px',color:'#6366f1'}}>{(g.downloadCount||0).toLocaleString()}</p>
                  <p style={{margin:0,fontSize:'10px',color:'#94a3b8'}}>downloads</p>
                </div>
              </div>
            ))
          }
        </div>
        <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'20px'}}>
          <h3 style={{margin:'0 0 16px',fontWeight:700}}>Traffic Overview</h3>
          <div style={{textAlign:'center',padding:'40px 20px',color:'#94a3b8'}}>
            <p style={{fontSize:'32px',margin:'0 0 8px'}}>\u{1F4CA}</p>
            <p style={{fontSize:'14px',margin:0}}>Connect Google Analytics for detailed traffic charts.</p>
            <p style={{fontSize:'13px',margin:'8px 0 0',color:'#6366f1'}}>Set GA ID in SEO Settings \u2192</p>
          </div>
        </div>
      </div>
      <div style={{background:'#e0f2fe',borderRadius:'10px',padding:'14px 18px',color:'#0369a1',fontSize:'13px'}}>
        \u2139\uFE0F For advanced analytics (country stats, device breakdown, real-time visitors), connect Google Analytics or Plausible via SEO Settings.
      </div>
    </div>
  )
}