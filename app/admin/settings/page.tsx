'use client'
import { useState, useEffect } from 'react'
export default function SiteSettingsPage() {
  const [cfg, setCfg] = useState<Record<string,any>>({ siteName:'CompressedGamesPC', siteUrl:'https://compressedgamespc.com', contactEmail:'', maintenanceMode:false, commentsEnabled:false, registrationEnabled:false, postsPerPage:'12', dateFormat:'DD/MM/YYYY', timezone:'Asia/Karachi' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    fetch('/api/settings?key=site', { cache: 'no-store' }).then(r => r.json()).then((d: any) => { if(d) setCfg((p: any) => ({...p,...d})) }).catch(()=>{})
  }, [])
  const set = (k: string, v: any) => setCfg((p: any) => ({...p,[k]:v}))
  const save = async () => {
    setSaving(true)
    await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({key:'site', value: cfg}) })
    setSaved(true); setTimeout(()=>setSaved(false),3000); setSaving(false)
  }
  const inp: any = { width:'100%', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'8px 12px', fontSize:'14px', boxSizing:'border-box' }
  const card: any = { background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,.08)' }
  const lbl: any = { display:'block', fontSize:'13px', fontWeight:500, color:'#374151', marginBottom:'6px' }
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
          <div><label style={lbl}>Site Name</label><input style={inp} value={cfg.siteName} onChange={(e: any)=>set('siteName',e.target.value)} /></div>
          <div><label style={lbl}>Site URL</label><input style={inp} value={cfg.siteUrl} onChange={(e: any)=>set('siteUrl',e.target.value)} /></div>
          <div><label style={lbl}>Contact Email</label><input style={inp} value={cfg.contactEmail} onChange={(e: any)=>set('contactEmail',e.target.value)} /></div>
          <div><label style={lbl}>Posts Per Page</label><input style={inp} type="number" value={cfg.postsPerPage} onChange={(e: any)=>set('postsPerPage',e.target.value)} /></div>
          <div><label style={lbl}>Timezone</label><input style={inp} value={cfg.timezone} onChange={(e: any)=>set('timezone',e.target.value)} /></div>
          <div><label style={lbl}>Date Format</label><input style={inp} value={cfg.dateFormat} onChange={(e: any)=>set('dateFormat',e.target.value)} /></div>
        </div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:600}}>Features</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {([['maintenanceMode','Maintenance Mode'],['commentsEnabled','Enable Comments'],['registrationEnabled','Allow Registration']] as [string,string][]).map(([k,l]) => (
            <label key={k} style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'}}>
              <input type="checkbox" checked={!!cfg[k]} onChange={(e: any)=>set(k,e.target.checked)} style={{width:'16px',height:'16px'}} />
              <span style={{fontSize:'14px'}}>{l}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'14px',fontWeight:600,cursor:'pointer',width:'100%',fontSize:'16px'}}>💾 Save Settings</button>
    </div>
  )
}