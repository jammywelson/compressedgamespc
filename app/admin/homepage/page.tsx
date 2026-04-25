'use client'
import { useState, useEffect } from 'react'
export default function HomepagePage() {
  const [cfg, setCfg] = useState<Record<string,any>>({showHero:true,showStats:true,showFeatured:true,showTrending:true,showLatest:true,showCategories:true,heroTitle:'Free Highly Compressed\nPC Games Download',heroSubtitle:'Direct download links. No surveys. Maximum compression!',heroBtnText:'Browse All Games',showHeroBrowse:true,featuredTitle:'Featured Games',trendingTitle:'Trending Now',latestTitle:'Latest Releases',statsGames:'1000+',statsCompression:'75%',statsSurveys:'0',sectionOrder:'hero,stats,featured,trending,latest,categories'})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{fetch('/api/settings?key=homepage',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'homepage',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'9px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff',fontFamily:'inherit'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const g2:any={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}
  const Tog=({k,label}:{k:string,label:string})=>(<label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',padding:'9px 14px',border:'2px solid',borderColor:cfg[k]?'#6366f1':'#e2e8f0',borderRadius:'8px',background:cfg[k]?'#f5f3ff':'#fff',userSelect:'none' as any}}><input type="checkbox" checked={!!cfg[k]} onChange={(e:any)=>set(k,e.target.checked)} style={{width:'15px',height:'15px',accentColor:'#6366f1'} as any} /><span style={{fontWeight:600,fontSize:'13px',color:cfg[k]?'#6366f1':'#6b7280'}}>{label}</span></label>)
  if(loading)return <div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Loading...</div>
  return(
    <div style={{padding:'24px',maxWidth:'900px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:800}}>\u{1F3E0} Homepage Control</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>\u2713 Saved!</span>}
          <a href="/" target="_blank" style={{background:'#f1f5f9',color:'#374151',borderRadius:'8px',padding:'9px 16px',fontWeight:600,fontSize:'13px',textDecoration:'none'}}>Preview \u2197</a>
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Sections (Show/Hide)</h3>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}><Tog k="showHero" label="\u{1F4CC} Hero Banner" /><Tog k="showStats" label="\u{1F4CA} Stats Bar" /><Tog k="showFeatured" label="\u2B50 Featured Games" /><Tog k="showTrending" label="\u{1F525} Trending Games" /><Tog k="showLatest" label="\u{1F195} Latest Games" /><Tog k="showCategories" label="\u{1F4C1} Categories" /></div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Hero Banner</h3>
        <div style={{marginBottom:'14px'}}><label style={lbl}>Hero Title</label><textarea style={{...inp,height:'60px',resize:'vertical'}} value={cfg.heroTitle} onChange={e=>set('heroTitle',(e.target as any).value)} /></div>
        <div style={g2}>
          <div><label style={lbl}>Subtitle</label><input style={inp} value={cfg.heroSubtitle} onChange={e=>set('heroSubtitle',(e.target as any).value)} /></div>
          <div><label style={lbl}>Button Text</label><input style={inp} value={cfg.heroBtnText} onChange={e=>set('heroBtnText',(e.target as any).value)} /></div>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Stats Bar</h3>
        <div style={g2}>
          <div><label style={lbl}>Games Count</label><input style={inp} value={cfg.statsGames} onChange={e=>set('statsGames',(e.target as any).value)} placeholder="1000+" /></div>
          <div><label style={lbl}>Avg Compression</label><input style={inp} value={cfg.statsCompression} onChange={e=>set('statsCompression',(e.target as any).value)} placeholder="75%" /></div>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Section Titles</h3>
        <div style={g2}>
          <div><label style={lbl}>Featured Section Title</label><input style={inp} value={cfg.featuredTitle} onChange={e=>set('featuredTitle',(e.target as any).value)} /></div>
          <div><label style={lbl}>Trending Section Title</label><input style={inp} value={cfg.trendingTitle} onChange={e=>set('trendingTitle',(e.target as any).value)} /></div>
          <div><label style={lbl}>Latest Section Title</label><input style={inp} value={cfg.latestTitle} onChange={e=>set('latestTitle',(e.target as any).value)} /></div>
        </div>
      </div>
      <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',width:'100%',fontWeight:700,cursor:'pointer',fontSize:'15px',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'\u{1F4BE} Save Homepage Settings'}</button>
    </div>
  )
}