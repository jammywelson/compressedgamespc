'use client'
import { useState, useEffect } from 'react'
export default function PermalinksPage() {
  const [cfg, setCfg] = useState({ structure: 'games', customPrefix: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    fetch('/api/settings?key=permalinks', { cache: 'no-store' }).then(r => r.json()).then(d => { if(d) setCfg(p => ({...p,...d})) }).catch(()=>{})
  }, [])
  const set = (k,v) => setCfg(p => ({...p,[k]:v}))
  const save = async () => {
    setSaving(true)
    await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({key:'permalinks', value: cfg}) })
    setSaved(true); setTimeout(()=>setSaved(false),3000); setSaving(false)
  }
  const card = { background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,.08)' }
  const label = { display:'block', fontSize:'13px', fontWeight:500, color:'#374151', marginBottom:'6px' }
  const inp = { width:'100%', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'8px 12px', fontSize:'14px', boxSizing:'border-box' as any }
  const structures = [
    { value:'games', label:'Default', example:'/games/game-name' },
    { value:'download', label:'Download', example:'/download/game-name' },
    { value:'g', label:'Short', example:'/g/game-name' },
    { value:'custom', label:'Custom', example:'/custom-prefix/game-name' },
  ]
  return (
    <div style={{padding:'24px',maxWidth:'700px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>🔗 Permalink Settings</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved && <span style={{color:'#16a34a',fontWeight:600}}>✓ Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:600,cursor:'pointer'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:600}}>URL Structure</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {structures.map(s => (
            <label key={s.value} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',border:'2px solid',borderColor:cfg.structure===s.value?'#4f46e5':'#e5e7eb',borderRadius:'8px',cursor:'pointer',background:cfg.structure===s.value?'#f5f3ff':'#fff'}}>
              <input type="radio" name="structure" value={s.value} checked={cfg.structure===s.value} onChange={()=>set('structure',s.value)} />
              <div>
                <div style={{fontWeight:600,fontSize:'14px'}}>{s.label}</div>
                <div style={{fontSize:'12px',color:'#6b7280',fontFamily:'monospace'}}>{s.example}</div>
              </div>
            </label>
          ))}
        </div>
        {cfg.structure==='custom' && (
          <div style={{marginTop:'16px'}}>
            <label style={label}>Custom Prefix</label>
            <input style={inp} value={cfg.customPrefix} onChange={e=>set('customPrefix',e.target.value)} placeholder="e.g. 'pc-games'" />
          </div>
        )}
      </div>
      <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'14px',fontWeight:600,cursor:'pointer',width:'100%',fontSize:'16px'}}>{saving?'Saving...':'💾 Save Permalink Settings'}</button>
    </div>
  )
}