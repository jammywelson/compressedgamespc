'use client'
import { useState, useEffect } from 'react'
export default function SeoPage() {
  const [cfg, setCfg] = useState<Record<string,any>>({seoTitle:'',seoDesc:'',seoKeywords:'',ogImage:'',googleAnalytics:'',googleTagManager:'',googleVerify:'',robotsTxt:'User-agent: *\nAllow: /'})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{fetch('/api/settings?key=seo',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'seo',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'9px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff',fontFamily:'inherit'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const g2:any={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}
  if(loading)return <div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Loading...</div>
  return(
    <div style={{padding:'24px',maxWidth:'900px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:800}}>\u{1F50D} SEO Settings</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>\u2713 Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Site Meta Tags</h3>
        <div style={{marginBottom:'14px'}}><label style={lbl}>Default SEO Title</label><input style={inp} value={cfg.seoTitle} onChange={e=>set('seoTitle',(e.target as any).value)} placeholder="Site Name - Your Tagline" /></div>
        <div style={{marginBottom:'14px'}}><label style={lbl}>Meta Description (150-160 chars)</label><textarea style={{...inp,height:'80px',resize:'vertical'}} value={cfg.seoDesc} onChange={e=>set('seoDesc',(e.target as any).value)} /></div>
        <div style={{...g2,marginBottom:'14px'}}>
          <div><label style={lbl}>Keywords (comma separated)</label><input style={inp} value={cfg.seoKeywords} onChange={e=>set('seoKeywords',(e.target as any).value)} /></div>
          <div><label style={lbl}>OG Image URL</label><input style={inp} value={cfg.ogImage} onChange={e=>set('ogImage',(e.target as any).value)} placeholder="https://..." /></div>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Google Integration</h3>
        <div style={g2}>
          <div><label style={lbl}>Google Analytics ID</label><input style={inp} value={cfg.googleAnalytics} onChange={e=>set('googleAnalytics',(e.target as any).value)} placeholder="G-XXXXXXXXXX" /></div>
          <div><label style={lbl}>Google Tag Manager ID</label><input style={inp} value={cfg.googleTagManager} onChange={e=>set('googleTagManager',(e.target as any).value)} placeholder="GTM-XXXXXXX" /></div>
          <div><label style={lbl}>Google Site Verification</label><input style={inp} value={cfg.googleVerify} onChange={e=>set('googleVerify',(e.target as any).value)} /></div>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 12px',fontWeight:700}}>Robots.txt</h3>
        <textarea style={{...inp,height:'140px',fontFamily:'monospace',fontSize:'13px'}} value={cfg.robotsTxt} onChange={e=>set('robotsTxt',(e.target as any).value)} />
      </div>
      <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',width:'100%',fontWeight:700,cursor:'pointer',fontSize:'15px',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'\u{1F4BE} Save SEO Settings'}</button>
    </div>
  )
}