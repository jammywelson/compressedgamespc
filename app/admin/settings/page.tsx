'use client'
import { useState, useEffect } from 'react'
export default function SiteSettingsPage() {
  const [cfg, setCfg] = useState({ siteName:'CompressedGamesPC', siteUrl:'https://compressedgamespc.com', contactEmail:'', maintenanceMode:false, commentsEnabled:false, registrationEnabled:false, postsPerPage:'12', dateFormat:'DD/MM/YYYY', timezone:'Asia/Karachi' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    fetch('/api/settings?key=site', { cache: 'no-store' }).then(r => r.json()).then(d => { if(d) setCfg(p => ({...p,...d})) }).catch(()=>{})
  }, [])
  const set = (k,v) => setCfg(p => ({...p,[k]:v}))
  const save = async () => {
    setSaving(true)
    await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({key:'site', value: cfg}) })
    setSaved(true); setTimeout(()=>setSaved(false),3000); setSaving(false)
  }
  const inp = { width:'100%', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'8px 12px', fontSize:'14px', boxSizing:'border-box' as any }
  const card = { background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,.08)' }
  const label = { display:'block', fontSize:'13px', fontWeight:500, color:'#374151', marginBottom:'6px' }
  return (
    <div style={{padding:'24px',maxWidth:'800px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>⚙️ Site Settings</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved && <span style={{color:'#16a34a',fontWeight:600}}>✓ Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:600,cursor:'pointer'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:600}}>General</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          <div><label style={label}>Site Name</label><input style={inp} value={cfg.siteName} onChange={e=>set('siteName',e.target.value)} /></div>
          <div><label style={label}>Site URL</label><input style={inp} value={cfg.siteUrl} onChange={e=>set('siteUrl',e.target.value)} /></div>
          <div><label style={label}>Contact Email</label><input style={inp} value={cfg.contactEmail} onChange={e=>set('contactEmail',e.target.value)} /></div>
          <div><label style={label}>Posts Per Page</label><input style={inp} type="number" value={cfg.postsPerPage} onChange={e=>set('postsPerPage',e.target.value)} /></div>
          <div><label style={label}>Timezone</label><input style={inp} value={cfg.timezone} onChange={e=>set('timezone',e.target.value)} /></div>
          <div><label style={label}>Date Format</label><input style={inp} value={cfg.dateFormat} onChange={e=>set('dateFormat',e.target.value)} /></div>
        </div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:600}}>Features</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {[['maintenanceMode','Maintenance Mode (site visitors will see maintenance page)'],['commentsEnabled','Enable Comments on Game Pages'],['registrationEnabled','Allow User Registration']].map(([k,l]) => (
            <label key={k} style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}}>
              <input type="checkbox" checked={!!(cfg as any)[k]} onChange={e=>set(k,e.target.checked)} style={{width:'16px',height:'16px'}} />
              <span style={{fontSize:'14px',color:'#374151'}}>{l}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'14px',fontWeight:600,cursor:'pointer',width:'100%',fontSize:'16px'}}>{saving?'Saving...':'💾 Save Settings'}</button>
    </div>
  )
}