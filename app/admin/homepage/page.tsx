'use client'
import { useState, useEffect } from 'react'
export default function HomepagePage() {
  const [cfg, setCfg] = useState<Record<string,any>>({heroEnabled:true,heroTitle:'Free Highly Compressed PC Games Download',heroSubtitle:'Direct download links. No surveys. Maximum compression!',heroBtnText:'Browse All Games',showStats:true,showFeatured:true,showTrending:true,showLatest:true,showCategories:true,featuredCount:'8',trendingCount:'8',latestCount:'12'})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{fetch('/api/settings?key=homepage',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'homepage',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const T2=({k,label}:{k:string,label:string})=>(
    <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',padding:'10px 16px',border:'2px solid',borderColor:cfg[k]?'#6366f1':'#e2e8f0',borderRadius:'8px',background:cfg[k]?'#f5f3ff':'#fff',userSelect:'none' as any}}>
      <input type="checkbox" checked={!!cfg[k]} onChange={(e:any)=>set(k,e.target.checked)} style={{width:'15px',height:'15px',accentColor:'#6366f1'} as any}/>
      <span style={{fontWeight:600,fontSize:'13px',color:cfg[k]?'#6366f1':'#6b7280'}}>{label}</span>
    </label>
  )
  if(loading) return <div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Loading...</div>
  return (
    <div style={{padding:'20px',maxWidth:'860px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>&#127968; Homepage Manager</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>&#10003; Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Hero Banner</h3>
        <div style={{marginBottom:'12px'}}><label style={lbl}>Hero Title</label><input style={inp} value={cfg.heroTitle} onChange={(e:any)=>set('heroTitle',e.target.value)}/></div>
        <div style={{marginBottom:'12px'}}><label style={lbl}>Hero Subtitle</label><input style={inp} value={cfg.heroSubtitle} onChange={(e:any)=>set('heroSubtitle',e.target.value)}/></div>
        <div style={{marginBottom:'12px'}}><label style={lbl}>Button Text</label><input style={inp} value={cfg.heroBtnText} onChange={(e:any)=>set('heroBtnText',e.target.value)}/></div>
        <T2 k="heroEnabled" label="Show Hero Banner"/>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Sections (Show/Hide)</h3>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap' as any}}>
          <T2 k="showStats" label="Stats Bar"/><T2 k="showFeatured" label="Featured Games"/><T2 k="showTrending" label="Trending"/><T2 k="showLatest" label="Latest Games"/><T2 k="showCategories" label="Categories"/>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Section Limits</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}}>
          <div><label style={lbl}>Featured Count</label><input style={inp} type="number" value={cfg.featuredCount} onChange={(e:any)=>set('featuredCount',e.target.value)}/></div>
          <div><label style={lbl}>Trending Count</label><input style={inp} type="number" value={cfg.trendingCount} onChange={(e:any)=>set('trendingCount',e.target.value)}/></div>
          <div><label style={lbl}>Latest Count</label><input style={inp} type="number" value={cfg.latestCount} onChange={(e:any)=>set('latestCount',e.target.value)}/></div>
        </div>
      </div>
      <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',width:'100%',fontWeight:700,cursor:'pointer',fontSize:'15px'}}>{saving?'Saving...':'&#128190; Save Homepage Settings'}</button>
    </div>
  )
}