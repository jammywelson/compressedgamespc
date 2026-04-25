'use client'
import { useState, useEffect } from 'react'
export default function AdsPage() {
  const [cfg, setCfg] = useState({ headerAd:'', footerAd:'', sidebarAd:'', inContentAd:'', adsEnabled:false, adFrequency:'5' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    fetch('/api/settings?key=ads', { cache: 'no-store' }).then(r => r.json()).then(d => { if(d) setCfg(p => ({...p,...d})) }).catch(()=>{})
  }, [])
  const set = (k,v) => setCfg(p => ({...p,[k]:v}))
  const save = async () => {
    setSaving(true)
    await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({key:'ads', value: cfg}) })
    setSaved(true); setTimeout(()=>setSaved(false),3000); setSaving(false)
  }
  const inp = { width:'100%', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'8px 12px', fontSize:'14px', boxSizing:'border-box' as any }
  const card = { background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,.08)' }
  const label = { display:'block', fontSize:'13px', fontWeight:500, color:'#374151', marginBottom:'6px' }
  return (
    <div style={{padding:'24px',maxWidth:'800px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>💰 Ad Inserter</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved && <span style={{color:'#16a34a',fontWeight:600}}>✓ Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:600,cursor:'pointer'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={card}>
        <label style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',marginBottom:'16px'}}>
          <input type="checkbox" checked={cfg.adsEnabled} onChange={e=>set('adsEnabled',e.target.checked)} style={{width:'16px',height:'16px'}} />
          <span style={{fontSize:'14px',fontWeight:600,color:'#374151'}}>Enable Ads</span>
        </label>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
          <div><label style={label}>In-Content Ad Frequency (every N games)</label><input style={inp} type="number" value={cfg.adFrequency} onChange={e=>set('adFrequency',e.target.value)} /></div>
        </div>
      </div>
      {[['headerAd','Header Ad (before navbar)'],['footerAd','Footer Ad (after footer)'],['sidebarAd','Sidebar Ad Code'],['inContentAd','In-Content Ad Code']].map(([k,l]) => (
        <div key={k} style={card}>
          <h3 style={{margin:'0 0 12px',fontSize:'15px',fontWeight:600}}>{l}</h3>
          <textarea style={{...inp,height:'100px',fontFamily:'monospace',fontSize:'12px',resize:'vertical'}} value={(cfg as any)[k]} onChange={e=>set(k,e.target.value)} placeholder="Paste ad code here (Google AdSense, etc.)..." />
        </div>
      ))}
      <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'14px',fontWeight:600,cursor:'pointer',width:'100%',fontSize:'16px'}}>{saving?'Saving...':'💾 Save Ad Settings'}</button>
    </div>
  )
}