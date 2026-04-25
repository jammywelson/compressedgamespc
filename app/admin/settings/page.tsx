'use client'
import { useState, useEffect } from 'react'
export default function SiteSettingsPage() {
  const [cfg, setCfg] = useState<Record<string,any>>({siteName:'CompressedGamesPC',siteUrl:'https://compressedgamespc.com',tagline:'Free Highly Compressed PC Games',contactEmail:'',logo:'',favicon:'',maintenanceMode:false,commentsEnabled:true,registrationEnabled:false,postsPerPage:'12',timezone:'Asia/Karachi'})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('general')
  useEffect(()=>{fetch('/api/settings?key=site',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{})},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'site',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'9px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const g2:any={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}
  const Tog=({k,label}:{k:string,label:string})=>(
    <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',padding:'10px 16px',border:'2px solid',borderColor:cfg[k]?'#6366f1':'#e2e8f0',borderRadius:'8px',background:cfg[k]?'#f5f3ff':'#fff',userSelect:'none' as any}}>
      <input type="checkbox" checked={!!cfg[k]} onChange={e=>set(k,e.target.checked)} style={{width:'16px',height:'16px',accentColor:'#6366f1'} as any} />
      <span style={{fontWeight:600,fontSize:'13px',color:cfg[k]?'#6366f1':'#6b7280'}}>{label}</span>
    </label>
  )
  const TABS=[{id:'general',l:'General'},{id:'features',l:'Features'},{id:'email',l:'Email'}]
  return (
    <div style={{padding:'20px',maxWidth:'900px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>&#9881;&#65039; Site Settings</h1>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>&#10003; Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'4px',marginBottom:'20px',borderBottom:'2px solid #e2e8f0'}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'10px 18px',border:'none',background:'transparent',cursor:'pointer',fontWeight:600,fontSize:'13px',color:tab===t.id?'#6366f1':'#64748b',borderBottom:tab===t.id?'2px solid #6366f1':'2px solid transparent',marginBottom:'-2px'}}>{t.l}</button>)}
      </div>
      {tab==='general'&&(
        <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Site Identity</h3>
          <div style={g2}>
            <div><label style={lbl}>Site Name</label><input style={inp} value={cfg.siteName} onChange={e=>set('siteName',e.target.value)} /></div>
            <div><label style={lbl}>Tagline</label><input style={inp} value={cfg.tagline} onChange={e=>set('tagline',e.target.value)} /></div>
            <div><label style={lbl}>Site URL</label><input style={inp} value={cfg.siteUrl} onChange={e=>set('siteUrl',e.target.value)} /></div>
            <div><label style={lbl}>Contact Email</label><input style={inp} value={cfg.contactEmail} onChange={e=>set('contactEmail',e.target.value)} /></div>
            <div><label style={lbl}>Logo URL</label><input style={inp} value={cfg.logo} onChange={e=>set('logo',e.target.value)} /></div>
            <div><label style={lbl}>Favicon URL</label><input style={inp} value={cfg.favicon} onChange={e=>set('favicon',e.target.value)} /></div>
            <div><label style={lbl}>Posts Per Page</label><input style={inp} type="number" value={cfg.postsPerPage} onChange={e=>set('postsPerPage',e.target.value)} /></div>
            <div><label style={lbl}>Timezone</label><input style={inp} value={cfg.timezone} onChange={e=>set('timezone',e.target.value)} /></div>
          </div>
        </div>
      )}
      {tab==='features'&&(
        <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Feature Toggles</h3>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <Tog k="maintenanceMode" label="Maintenance Mode" />
            <Tog k="commentsEnabled" label="Comments" />
            <Tog k="registrationEnabled" label="User Registration" />
          </div>
        </div>
      )}
      {tab==='email'&&(
        <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Email Settings</h3>
          <p style={{color:'#64748b',fontSize:'14px',margin:'0 0 14px'}}>Configure SMTP for email notifications.</p>
          <div style={g2}>
            <div><label style={lbl}>From Email</label><input style={inp} value={cfg.emailFrom||''} onChange={e=>set('emailFrom',e.target.value)} /></div>
            <div><label style={lbl}>SMTP Host</label><input style={inp} value={cfg.smtpHost||''} onChange={e=>set('smtpHost',e.target.value)} /></div>
            <div><label style={lbl}>SMTP Port</label><input style={inp} value={cfg.smtpPort||'587'} onChange={e=>set('smtpPort',e.target.value)} /></div>
            <div><label style={lbl}>SMTP User</label><input style={inp} value={cfg.smtpUser||''} onChange={e=>set('smtpUser',e.target.value)} /></div>
            <div><label style={lbl}>SMTP Password</label><input style={inp} type="password" value={cfg.smtpPass||''} onChange={e=>set('smtpPass',e.target.value)} /></div>
          </div>
        </div>
      )}
      <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',width:'100%',fontWeight:700,cursor:'pointer',fontSize:'15px',marginTop:'8px'}}>{saving?'Saving...':'&#128190; Save Settings'}</button>
    </div>
  )
}