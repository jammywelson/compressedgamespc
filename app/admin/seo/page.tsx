'use client'
import { useState, useEffect } from 'react'
export default function SeoPage() {
  const [cfg, setCfg] = useState({ seoTitle:'', seoDesc:'', seoKeywords:'', ogImage:'', googleAnalytics:'', googleVerify:'', robotsTxt:'User-agent: *\nAllow: /' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    fetch('/api/settings?key=seo', { cache: 'no-store' }).then(r => r.json()).then(d => { if(d) setCfg(p => ({...p,...d})) }).catch(()=>{})
  }, [])
  const set = (k,v) => setCfg(p => ({...p,[k]:v}))
  const save = async () => {
    setSaving(true)
    await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({key:'seo', value: cfg}) })
    setSaved(true); setTimeout(()=>setSaved(false),3000); setSaving(false)
  }
  const inp = { width:'100%', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'8px 12px', fontSize:'14px', boxSizing:'border-box' as any }
  const card = { background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,.08)' }
  const label = { display:'block', fontSize:'13px', fontWeight:500, color:'#374151', marginBottom:'6px' }
  return (
    <div style={{padding:'24px', maxWidth:'800px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>🔍 SEO Settings</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved && <span style={{color:'#16a34a',fontWeight:600}}>✓ Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:600,cursor:'pointer'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:600}}>Meta Tags</h3>
        <div style={{marginBottom:'12px'}}><label style={label}>Default SEO Title</label><input style={inp} value={cfg.seoTitle} onChange={e=>set('seoTitle',e.target.value)} placeholder="CompressedGamesPC - Free PC Games" /></div>
        <div style={{marginBottom:'12px'}}><label style={label}>Meta Description</label><textarea style={{...inp,height:'80px',resize:'vertical'}} value={cfg.seoDesc} onChange={e=>set('seoDesc',e.target.value)} placeholder="Download highly compressed PC games..." /></div>
        <div style={{marginBottom:'12px'}}><label style={label}>Keywords</label><input style={inp} value={cfg.seoKeywords} onChange={e=>set('seoKeywords',e.target.value)} placeholder="compressed pc games, free games download..." /></div>
        <div><label style={label}>OG Image URL</label><input style={inp} value={cfg.ogImage} onChange={e=>set('ogImage',e.target.value)} placeholder="https://..." /></div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:600}}>Analytics & Verification</h3>
        <div style={{marginBottom:'12px'}}><label style={label}>Google Analytics ID</label><input style={inp} value={cfg.googleAnalytics} onChange={e=>set('googleAnalytics',e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
        <div><label style={label}>Google Site Verification</label><input style={inp} value={cfg.googleVerify} onChange={e=>set('googleVerify',e.target.value)} placeholder="google-site-verification=..." /></div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:600}}>Robots.txt</h3>
        <textarea style={{...inp,height:'120px',fontFamily:'monospace',fontSize:'13px'}} value={cfg.robotsTxt} onChange={e=>set('robotsTxt',e.target.value)} />
      </div>
      <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'14px',fontWeight:600,cursor:'pointer',width:'100%',fontSize:'16px'}}>{saving?'Saving...':'💾 Save SEO Settings'}</button>
    </div>
  )
}