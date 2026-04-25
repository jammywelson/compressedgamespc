'use client'
import { useState, useEffect } from 'react'

export default function HomepagePage() {
  const [cfg, setCfg] = useState<Record<string,any>>({
    heroEnabled:true, heroTitle:'Free Highly Compressed PC Games Download', heroSubtitle:'Direct download links. No surveys. Maximum compression!',
    heroBtnText:'Browse All Games', featuredEnabled:true, trendingEnabled:true,
    latestEnabled:true, latestCount:12, statsEnabled:true, categoriesEnabled:true,
    heroStyle:'gradient', sections:['hero','stats','featured','trending','latest','categories']
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings?key=homepage&t='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const set = (k:string,v:any) => setCfg(p=>({...p,[k]:v}))
  const save = async () => {
    setSaving(true)
    await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'homepage',value:cfg})})
    setSaved(true); setTimeout(()=>setSaved(false),3000); setSaving(false)
  }

  const inp:any = {width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'10px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box'}
  const lbl:any = {display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const card:any = {background:'#fff',borderRadius:'12px',padding:'20px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',marginBottom:'16px'}
  const T = ({k,l}:{k:string,l:string}) => <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',padding:'8px 14px',border:'2px solid',borderColor:cfg[k]?'#4f46e5':'#e5e7eb',borderRadius:'8px',background:cfg[k]?'#f5f3ff':'#fff'}}><input type='checkbox' checked={!!cfg[k]} onChange={(e:any)=>set(k,e.target.checked)} style={{width:'16px',height:'16px',accentColor:'#4f46e5'} as any} /><span style={{fontSize:'13px',fontWeight:500,color:cfg[k]?'#4f46e5':'#6b7280'}}>{l}</span></label>

  if (loading) return <div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Loading...</div>

  return (
    <div style={{maxWidth:'800px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700,color:'#0f172a'}}>\ud83c\udfe0 Homepage Control</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>\u2713 Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',fontSize:'14px'}}>{saving?'Saving...':'\ud83d\udcbe Save'}</button>
        </div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:700}}>Hero Banner</h3>
        <div style={{marginBottom:'14px'}}><T k='heroEnabled' l='Show Hero Banner' /></div>
        <div style={{marginBottom:'14px'}}><label style={lbl}>Hero Title</label><input style={inp} value={cfg.heroTitle||''} onChange={(e:any)=>set('heroTitle',e.target.value)} /></div>
        <div style={{marginBottom:'14px'}}><label style={lbl}>Hero Subtitle</label><input style={inp} value={cfg.heroSubtitle||''} onChange={(e:any)=>set('heroSubtitle',e.target.value)} /></div>
        <div><label style={lbl}>Button Text</label><input style={inp} value={cfg.heroBtnText||''} onChange={(e:any)=>set('heroBtnText',e.target.value)} /></div>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:700}}>Sections (Enable / Disable)</h3>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap' as any}}>
          <T k='statsEnabled' l='Stats Bar' />
          <T k='featuredEnabled' l='Featured Games' />
          <T k='trendingEnabled' l='Trending Games' />
          <T k='latestEnabled' l='Latest Games' />
          <T k='categoriesEnabled' l='Categories Section' />
        </div>
        <div style={{marginTop:'14px'}}><label style={lbl}>Latest Games Count</label><input style={{...inp,width:'120px'}} type='number' value={cfg.latestCount||12} onChange={(e:any)=>set('latestCount',e.target.value)} /></div>
      </div>
    </div>
  )
}