'use client'
import { useState, useEffect } from 'react'
export default function SeoPage() {
  const [cfg, setCfg] = useState<Record<string,any>>({seoTitle:'',seoDesc:'',seoKeywords:'',ogImage:'',googleAnalytics:'',googleVerify:'',robotsTxt:'User-agent: *
Allow: /'})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(()=>{fetch('/api/settings?key=seo',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{})},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'seo',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'9px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  return (
    <div style={{padding:'20px',maxWidth:'800px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>SEO Settings</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontWeight:700}}>Meta Tags</h3>
        <div style={{marginBottom:'12px'}}><label style={lbl}>Default SEO Title</label><input style={inp} value={cfg.seoTitle} onChange={(e:any)=>set('seoTitle',e.target.value)} placeholder="Site name - tagline"/></div>
        <div style={{marginBottom:'12px'}}><label style={lbl}>Meta Description</label><textarea style={{...inp,height:'80px',resize:'vertical'}} value={cfg.seoDesc} onChange={(e:any)=>set('seoDesc',e.target.value)}/></div>
        <div style={{marginBottom:'12px'}}><label style={lbl}>Keywords</label><input style={inp} value={cfg.seoKeywords} onChange={(e:any)=>set('seoKeywords',e.target.value)} placeholder="comma,separated"/></div>
        <div><label style={lbl}>OG Image URL</label><input style={inp} value={cfg.ogImage} onChange={(e:any)=>set('ogImage',e.target.value)} placeholder="https://..."/></div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontWeight:700}}>Google</h3>
        <div style={{marginBottom:'12px'}}><label style={lbl}>Analytics ID</label><input style={inp} value={cfg.googleAnalytics} onChange={(e:any)=>set('googleAnalytics',e.target.value)} placeholder="G-XXXXXXXXXX"/></div>
        <div><label style={lbl}>Site Verification</label><input style={inp} value={cfg.googleVerify} onChange={(e:any)=>set('googleVerify',e.target.value)}/></div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 12px',fontWeight:700}}>Robots.txt</h3>
        <textarea style={{...inp,height:'140px',fontFamily:'monospace',fontSize:'13px'}} value={cfg.robotsTxt} onChange={(e:any)=>set('robotsTxt',e.target.value)}/>
      </div>
      <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',width:'100%',fontWeight:700,cursor:'pointer',fontSize:'15px'}}>{saving?'Saving...':'Save SEO Settings'}</button>
    </div>
  )
}