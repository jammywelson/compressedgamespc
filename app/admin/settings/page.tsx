'use client'
import { useState, useEffect } from 'react'
export default function SiteSettingsPage() {
  const [cfg, setCfg] = useState<Record<string,any>>({siteName:'CompressedGamesPC',siteUrl:'https://compressedgamespc.com',tagline:'Free Highly Compressed PC Games',contactEmail:'',logo:'',favicon:'',maintenanceMode:false,commentsEnabled:true,registrationEnabled:false,postsPerPage:'12',timezone:'Asia/Karachi',dateFormat:'DD/MM/YYYY',emailFrom:'',smtpHost:'',smtpPort:'587',smtpUser:'',smtpPass:'',facebookUrl:'',twitterUrl:'',youtubeUrl:'',telegramUrl:''})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('general')
  useEffect(()=>{fetch('/api/settings?key=site',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'site',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'9px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff',fontFamily:'inherit'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const g2:any={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}
  const Tog=({k,label}:{k:string,label:string})=>(<label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',padding:'9px 14px',border:'2px solid',borderColor:cfg[k]?'#6366f1':'#e2e8f0',borderRadius:'8px',background:cfg[k]?'#f5f3ff':'#fff',userSelect:'none' as any}}><input type="checkbox" checked={!!cfg[k]} onChange={(e:any)=>set(k,e.target.checked)} style={{width:'15px',height:'15px',accentColor:'#6366f1'} as any} /><span style={{fontWeight:600,fontSize:'13px',color:cfg[k]?'#6366f1':'#6b7280'}}>{label}</span></label>)
  const TABS=[{id:'general',l:'General'},{id:'social',l:'Social Links'},{id:'features',l:'Features'},{id:'email',l:'Email/SMTP'}]
  if(loading)return <div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Loading...</div>
  return(
    <div style={{padding:'24px',maxWidth:'960px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:800}}>\u2699\uFE0F Site Settings</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>\u2713 Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'0',marginBottom:'20px',borderBottom:'2px solid #e2e8f0'}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'10px 20px',border:'none',background:'transparent',cursor:'pointer',fontWeight:600,fontSize:'13px',color:tab===t.id?'#6366f1':'#64748b',borderBottom:tab===t.id?'2px solid #6366f1':'2px solid transparent',marginBottom:'-2px'}}>{t.l}</button>)}
      </div>
      {tab==='general'&&(<div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>General Settings</h3>
        <div style={g2}>
          <div><label style={lbl}>Site Name</label><input style={inp} value={cfg.siteName} onChange={e=>set('siteName',(e.target as any).value)} /></div>
          <div><label style={lbl}>Tagline</label><input style={inp} value={cfg.tagline} onChange={e=>set('tagline',(e.target as any).value)} /></div>
          <div><label style={lbl}>Site URL</label><input style={inp} value={cfg.siteUrl} onChange={e=>set('siteUrl',(e.target as any).value)} /></div>
          <div><label style={lbl}>Contact Email</label><input style={inp} value={cfg.contactEmail} onChange={e=>set('contactEmail',(e.target as any).value)} /></div>
          <div><label style={lbl}>Logo URL</label><input style={inp} value={cfg.logo} onChange={e=>set('logo',(e.target as any).value)} placeholder="https://..." /></div>
          <div><label style={lbl}>Favicon URL</label><input style={inp} value={cfg.favicon} onChange={e=>set('favicon',(e.target as any).value)} placeholder="https://..." /></div>
          <div><label style={lbl}>Posts Per Page</label><input style={inp} type="number" value={cfg.postsPerPage} onChange={e=>set('postsPerPage',(e.target as any).value)} /></div>
          <div><label style={lbl}>Timezone</label><input style={inp} value={cfg.timezone} onChange={e=>set('timezone',(e.target as any).value)} /></div>
        </div>
      </div>)}
      {tab==='social'&&(<div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Social Media Links</h3>
        <div style={g2}>
          <div><label style={lbl}>Facebook</label><input style={inp} value={cfg.facebookUrl} onChange={e=>set('facebookUrl',(e.target as any).value)} placeholder="https://facebook.com/..." /></div>
          <div><label style={lbl}>Telegram</label><input style={inp} value={cfg.telegramUrl} onChange={e=>set('telegramUrl',(e.target as any).value)} placeholder="https://t.me/..." /></div>
          <div><label style={lbl}>YouTube</label><input style={inp} value={cfg.youtubeUrl} onChange={e=>set('youtubeUrl',(e.target as any).value)} placeholder="https://youtube.com/..." /></div>
          <div><label style={lbl}>Twitter/X</label><input style={inp} value={cfg.twitterUrl} onChange={e=>set('twitterUrl',(e.target as any).value)} placeholder="https://twitter.com/..." /></div>
        </div>
      </div>)}
      {tab==='features'&&(<div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Feature Toggles</h3>
        <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}><Tog k="maintenanceMode" label="\u{1F6A7} Maintenance Mode" /><Tog k="commentsEnabled" label="\u{1F4AC} Comments Enabled" /><Tog k="registrationEnabled" label="\u{1F465} User Registration" /></div>
      </div>)}
      {tab==='email'&&(<div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Email / SMTP Settings</h3>
        <div style={g2}>
          <div><label style={lbl}>From Email</label><input style={inp} value={cfg.emailFrom} onChange={e=>set('emailFrom',(e.target as any).value)} /></div>
          <div><label style={lbl}>SMTP Host</label><input style={inp} value={cfg.smtpHost} onChange={e=>set('smtpHost',(e.target as any).value)} /></div>
          <div><label style={lbl}>SMTP Port</label><input style={inp} value={cfg.smtpPort} onChange={e=>set('smtpPort',(e.target as any).value)} /></div>
          <div><label style={lbl}>SMTP Username</label><input style={inp} value={cfg.smtpUser} onChange={e=>set('smtpUser',(e.target as any).value)} /></div>
          <div style={{gridColumn:'1/-1'}}><label style={lbl}>SMTP Password</label><input style={inp} type="password" value={cfg.smtpPass} onChange={e=>set('smtpPass',(e.target as any).value)} /></div>
        </div>
      </div>)}
      <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',width:'100%',fontWeight:700,cursor:'pointer',fontSize:'15px',marginTop:'8px',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'\u{1F4BE} Save Settings'}</button>
    </div>
  )
}