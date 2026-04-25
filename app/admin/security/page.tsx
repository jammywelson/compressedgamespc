'use client'
import { useState, useEffect } from 'react'

export default function Page() {
  const [cfg, setCfg] = useState<Record<string,any>>({"maxLoginAttempts":5,"lockoutDuration":15,"sessionTimeout":24,"twoFaRequired":false,"ipWhitelistEnabled":false,"blockedIps":"","recaptchaSiteKey":"","recaptchaSecretKey":"","recaptchaEnabled":false})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings?key=security&t='+Date.now(), {cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const set = (k:string,v:any) => setCfg(p=>({...p,[k]:v}))
  const save = async () => {
    setSaving(true)
    await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'security',value:cfg})})
    setSaved(true); setTimeout(()=>setSaved(false),3000); setSaving(false)
  }

  const inp: any = {width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'10px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box'}
  const lbl: any = {display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const card: any = {background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',marginBottom:'16px'}
  const g2: any = {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}
  const T = ({k,l}:{k:string,l:string}) => <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',padding:'8px 14px',border:'2px solid',borderColor:cfg[k]?'#4f46e5':'#e5e7eb',borderRadius:'8px',background:cfg[k]?'#f5f3ff':'#fff',userSelect:'none' as any}}><input type='checkbox' checked={!!cfg[k]} onChange={(e:any)=>set(k,e.target.checked)} style={{width:'16px',height:'16px',accentColor:'#4f46e5'} as any} /><span style={{fontSize:'13px',fontWeight:500,color:cfg[k]?'#4f46e5':'#6b7280'}}>{l}</span></label>

  if (loading) return <div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Loading...</div>

  return (
    <div style={{maxWidth:'860px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap' as any,gap:'12px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700,color:'#0f172a'}}>\ud83d\udee1\ufe0f Security Settings</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>\u2713 Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:saving?'#818cf8':'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',fontSize:'14px'}}>{saving?'Saving...':'\ud83d\udcbe Save Changes'}</button>
        </div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:700}}>Login Security</h3>
        <div style={g2}>
          <div><label style={lbl}>Max Login Attempts</label><input style={inp} type='number' value={cfg.maxLoginAttempts||5} onChange={(e:any)=>set('maxLoginAttempts',e.target.value)} /></div>
          <div><label style={lbl}>Lockout Duration (min)</label><input style={inp} type='number' value={cfg.lockoutDuration||15} onChange={(e:any)=>set('lockoutDuration',e.target.value)} /></div>
          <div><label style={lbl}>Session Timeout (hours)</label><input style={inp} type='number' value={cfg.sessionTimeout||24} onChange={(e:any)=>set('sessionTimeout',e.target.value)} /></div>
        </div>
        <div style={{marginTop:'14px',display:'flex',gap:'10px',flexWrap:'wrap' as any}}>
          <T k='twoFaRequired' l='Require 2FA for Admins' /><T k='ipWhitelistEnabled' l='IP Whitelist' />
        </div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:700}}>Blocked IPs</h3>
        <textarea style={{...inp,height:'120px',fontFamily:'monospace',fontSize:'13px',marginBottom:'12px'}} value={cfg.blockedIps||''} onChange={(e:any)=>set('blockedIps',e.target.value)} placeholder='One IP per line...' />
        <p style={{margin:0,fontSize:'12px',color:'#94a3b8'}}>Add IPs to block. One per line. Changes apply after save.</p>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:700}}>Spam Protection</h3>
        <div style={g2}>
          <div><label style={lbl}>reCAPTCHA Site Key</label><input style={inp} value={cfg.recaptchaSiteKey||''} onChange={(e:any)=>set('recaptchaSiteKey',e.target.value)} /></div>
          <div><label style={lbl}>reCAPTCHA Secret Key</label><input style={inp} value={cfg.recaptchaSecretKey||''} onChange={(e:any)=>set('recaptchaSecretKey',e.target.value)} /></div>
        </div>
        <div style={{marginTop:'12px'}}><T k='recaptchaEnabled' l='Enable reCAPTCHA' /></div>
      </div>
      <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'12px',padding:'14px',fontWeight:700,cursor:'pointer',width:'100%',fontSize:'16px',marginTop:'8px'}}>{saving?'Saving...':'\ud83d\udcbe Save All Changes'}</button>
    </div>
  )
}