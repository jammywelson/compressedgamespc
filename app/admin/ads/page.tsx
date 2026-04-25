'use client'
import { useState, useEffect } from 'react'
export default function AdsPage() {
  const [cfg, setCfg] = useState<Record<string,any>>({adsEnabled:false,headerAd:'',footerAd:'',sidebarAd:'',inContentAd:'',popupAd:'',adFrequency:'5',popupEnabled:false,popupDelay:'5'})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{fetch('/api/settings?key=ads',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'ads',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'9px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff',fontFamily:'inherit'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const Tog=({k,label}:{k:string,label:string})=>(<label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}><input type="checkbox" checked={!!cfg[k]} onChange={(e:any)=>set(k,e.target.checked)} style={{width:'16px',height:'16px',accentColor:'#6366f1'} as any} /><span style={{fontWeight:600,fontSize:'14px'}}>{label}</span></label>)
  if(loading)return <div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Loading...</div>
  const SLOTS:[string,string,string][]=[['headerAd','Header Ad','Displayed before the navbar'],['footerAd','Footer Ad','Displayed after the footer'],['sidebarAd','Sidebar Ad','Game detail page sidebar'],['inContentAd','In-Content Ad','Between game listings'],['popupAd','Popup Ad','Overlay popup on page load']]
  return(
    <div style={{padding:'24px',maxWidth:'900px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:800}}>\u{1F4B0} Ads Manager</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>\u2713 Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={{...card,display:'flex',gap:'24px',alignItems:'center',flexWrap:'wrap'}}>
        <Tog k="adsEnabled" label="Enable Ads Globally" />
        <Tog k="popupEnabled" label="Enable Popup Ad" />
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <label style={{...lbl,margin:0,whiteSpace:'nowrap'}}>In-Content Every:</label>
          <input style={{...inp,width:'70px'}} type="number" value={cfg.adFrequency} onChange={e=>set('adFrequency',(e.target as any).value)} />
          <span style={{fontSize:'13px',color:'#64748b'}}>games</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <label style={{...lbl,margin:0,whiteSpace:'nowrap'}}>Popup Delay:</label>
          <input style={{...inp,width:'70px'}} type="number" value={cfg.popupDelay} onChange={e=>set('popupDelay',(e.target as any).value)} />
          <span style={{fontSize:'13px',color:'#64748b'}}>seconds</span>
        </div>
      </div>
      {SLOTS.map(([k,label,hint])=>(
        <div key={k} style={card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
            <h3 style={{margin:0,fontWeight:700,fontSize:'15px'}}>{label}</h3>
            <span style={{fontSize:'12px',color:'#94a3b8',background:'#f1f5f9',padding:'3px 10px',borderRadius:'20px'}}>{hint}</span>
          </div>
          <textarea style={{...inp,height:'110px',fontFamily:'monospace',fontSize:'12px',resize:'vertical'}} value={(cfg as any)[k]||''} onChange={e=>set(k,(e.target as any).value)} placeholder="<!-- Paste your Google AdSense, custom HTML, or any ad code here -->" />
        </div>
      ))}
      <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',width:'100%',fontWeight:700,cursor:'pointer',fontSize:'15px',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'\u{1F4BE} Save Ad Settings'}</button>
    </div>
  )
}