'use client'
import { useState } from 'react'

const inp: React.CSSProperties = { width:'100%', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'9px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }
const lbl: React.CSSProperties = { fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }
const card: React.CSSProperties = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 3px rgba(0,0,0,.05)' }
const sTitle: React.CSSProperties = { fontFamily:'Rajdhani, sans-serif', fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'16px', paddingBottom:'10px', borderBottom:'1px solid #f3f4f6' }

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [s, setS] = useState({ siteName:'CompressedGamesPC', tagline:'Free Highly Compressed PC Games', siteEmail:'admin@compressedgamespc.com', siteUrl:'https://compressedgamespc.com', timezone:'Asia/Karachi', language:'English', maintenanceMode:false, registrationEnabled:false, commentsEnabled:true, cacheEnabled:true, dmcaEmail:'dmca@compressedgamespc.com' })
  const upd = (k:string, v:any) => setS(x => ({...x,[k]:v}))

  return (
    <div>
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:'54px',display:'flex',alignItems:'center'}}>
        <span style={{fontFamily:'Rajdhani, sans-serif',fontSize:'18px',fontWeight:700,color:'#111827'}}>Site Settings</span>
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}} style={{marginLeft:'auto',background:saved?'#16a34a':'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'8px 20px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{saved?'✓ Saved!':'Save'}</button>
      </div>
      <div style={{padding:'24px',maxWidth:'800px'}}>
        <div style={card}>
          <div style={sTitle}>General</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
            <div><label style={lbl}>Site Name</label><input style={inp} value={s.siteName} onChange={e=>upd('siteName',e.target.value)}/></div>
            <div><label style={lbl}>Tagline</label><input style={inp} value={s.tagline} onChange={e=>upd('tagline',e.target.value)}/></div>
            <div><label style={lbl}>Site URL</label><input style={inp} value={s.siteUrl} onChange={e=>upd('siteUrl',e.target.value)}/></div>
            <div><label style={lbl}>Admin Email</label><input style={inp} value={s.siteEmail} onChange={e=>upd('siteEmail',e.target.value)}/></div>
            <div><label style={lbl}>Timezone</label><select style={{...inp,cursor:'pointer'}} value={s.timezone} onChange={e=>upd('timezone',e.target.value)}>{['Asia/Karachi','Asia/Kolkata','Asia/Dubai','Europe/London'].map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label style={lbl}>Language</label><select style={{...inp,cursor:'pointer'}} value={s.language} onChange={e=>upd('language',e.target.value)}>{['English','Urdu','Arabic'].map(l=><option key={l}>{l}</option>)}</select></div>
          </div>
        </div>
        <div style={card}>
          <div style={sTitle}>Features</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            {[{k:'maintenanceMode',l:'Maintenance Mode',d:'Show maintenance page'},{k:'registrationEnabled',l:'User Registration',d:'Allow signups'},{k:'commentsEnabled',l:'User Reviews',d:'Show reviews on games'},{k:'cacheEnabled',l:'Page Caching',d:'Speed up site'}].map(f=>(
              <div key={f.k} style={{background:'#f9fafb',borderRadius:'8px',padding:'12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div><div style={{fontSize:'13px',fontWeight:600,color:'#111827'}}>{f.l}</div><div style={{fontSize:'11px',color:'#6b7280'}}>{f.d}</div></div>
                <div style={{position:'relative',width:'40px',height:'22px',cursor:'pointer'}} onClick={()=>upd(f.k,!(s as any)[f.k])}>
                  <div style={{width:'40px',height:'22px',borderRadius:'11px',background:(s as any)[f.k]?'#4f46e5':'#d1d5db',transition:'background .2s'}}/>
                  <div style={{position:'absolute',top:'3px',left:(s as any)[f.k]?'21px':'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .2s'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={card}>
          <div style={sTitle}>DMCA</div>
          <div><label style={lbl}>DMCA Contact Email</label><input style={inp} value={s.dmcaEmail} onChange={e=>upd('dmcaEmail',e.target.value)}/></div>
        </div>
      </div>
    </div>
  )
}
