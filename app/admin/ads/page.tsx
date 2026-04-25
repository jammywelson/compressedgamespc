'use client'
import { useState, useEffect } from 'react'
export default function AdsPage() {
  const [cfg, setCfg] = useState<Record<string,any>>({adsEnabled:false,headerAd:'',footerAd:'',sidebarAd:'',inContentAd:'',popupAd:'',adFrequency:'5',popupEnabled:false})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(()=>{fetch('/api/settings?key=ads',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{})},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'ads',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'9px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const slots:[string,string][]=[['headerAd','Header Ad'],['footerAd','Footer Ad'],['sidebarAd','Sidebar Ad'],['inContentAd','In-Content Ad'],['popupAd','Popup Ad']]
  return (
    <div style={{padding:'20px',maxWidth:'900px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>&#128176; Ads Manager</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>&#10003; Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={{...card,display:'flex',gap:'20px',alignItems:'center',flexWrap:'wrap'}}>
        <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
          <input type="checkbox" checked={!!cfg.adsEnabled} onChange={e=>set('adsEnabled',e.target.checked)} style={{width:'16px',height:'16px',accentColor:'#6366f1'} as any} />
          <span style={{fontWeight:600,fontSize:'14px'}}>Enable Ads Globally</span>
        </label>
        <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
          <input type="checkbox" checked={!!cfg.popupEnabled} onChange={e=>set('popupEnabled',e.target.checked)} style={{width:'16px',height:'16px',accentColor:'#6366f1'} as any} />
          <span style={{fontWeight:600,fontSize:'14px'}}>Enable Popup Ad</span>
        </label>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <label style={{...lbl,margin:0}}>Frequency (every N games):</label>
          <input style={{...inp,width:'70px'}} type="number" value={cfg.adFrequency} onChange={e=>set('adFrequency',e.target.value)} />
        </div>
      </div>
      {slots.map(([k,label])=>(
        <div key={k} style={card}>
          <h3 style={{margin:'0 0 10px',fontWeight:700,fontSize:'15px'}}>{label}</h3>
          <textarea style={{...inp,height:'100px',fontFamily:'monospace',fontSize:'12px',resize:'vertical'}} value={(cfg as any)[k]||''} onChange={e=>set(k,e.target.value)} placeholder="Paste ad code here (Google AdSense, etc.)..." />
        </div>
      ))}
      <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',width:'100%',fontWeight:700,cursor:'pointer',fontSize:'15px'}}>{saving?'Saving...':'&#128190; Save Ad Settings'}</button>
    </div>
  )
}