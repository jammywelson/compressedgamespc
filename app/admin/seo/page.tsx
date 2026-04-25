'use client'
import { useState, useEffect } from 'react'

export default function Page() {
  const [cfg, setCfg] = useState<Record<string,any>>({"seoTitle":"","seoDesc":"","seoKeywords":"","ogImage":"","googleAnalytics":"","googleVerify":"","bingVerify":"","fbPixel":"","robotsTxt":"User-agent: *\nAllow: /","sitemapEnabled":true,"schemaEnabled":true,"openGraphEnabled":true})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings?key=seo&t='+Date.now(), {cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const set = (k:string,v:any) => setCfg(p=>({...p,[k]:v}))
  const save = async () => {
    setSaving(true)
    await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'seo',value:cfg})})
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
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700,color:'#0f172a'}}>\ud83d\udd0d SEO Settings</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>\u2713 Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:saving?'#818cf8':'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',fontSize:'14px'}}>{saving?'Saving...':'\ud83d\udcbe Save Changes'}</button>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:700}}>Meta Tags</h3>
        <div style={{marginBottom:'14px'}}><label style={lbl}>Default SEO Title</label><input style={inp} value={cfg.seoTitle||''} onChange={(e:any)=>set('seoTitle',e.target.value)} /></div>
        <div style={{marginBottom:'14px'}}><label style={lbl}>Meta Description</label><textarea style={{...inp,height:'80px',resize:'vertical'}} value={cfg.seoDesc||''} onChange={(e:any)=>set('seoDesc',e.target.value)} /></div>
        <div style={g2}>
          <div><label style={lbl}>Keywords</label><input style={inp} value={cfg.seoKeywords||''} onChange={(e:any)=>set('seoKeywords',e.target.value)} /></div>
          <div><label style={lbl}>OG Image URL</label><input style={inp} value={cfg.ogImage||''} onChange={(e:any)=>set('ogImage',e.target.value)} /></div>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:700}}>Analytics & Verification</h3>
        <div style={g2}>
          <div><label style={lbl}>Google Analytics ID</label><input style={inp} value={cfg.googleAnalytics||''} onChange={(e:any)=>set('googleAnalytics',e.target.value)} placeholder='G-XXXXXXXXXX' /></div>
          <div><label style={lbl}>Google Verification</label><input style={inp} value={cfg.googleVerify||''} onChange={(e:any)=>set('googleVerify',e.target.value)} /></div>
          <div><label style={lbl}>Bing Verification</label><input style={inp} value={cfg.bingVerify||''} onChange={(e:any)=>set('bingVerify',e.target.value)} /></div>
          <div><label style={lbl}>Facebook Pixel ID</label><input style={inp} value={cfg.fbPixel||''} onChange={(e:any)=>set('fbPixel',e.target.value)} /></div>
        </div>
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:700}}>Robots.txt</h3>
        <textarea style={{...inp,height:'140px',fontFamily:'monospace',fontSize:'13px'}} value={cfg.robotsTxt||'User-agent: *\nAllow: /'} onChange={(e:any)=>set('robotsTxt',e.target.value)} />
      </div>
      <div style={card}><h3 style={{margin:'0 0 16px',fontSize:'16px',fontWeight:700}}>Features</h3>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap' as any}}><T k='sitemapEnabled' l='XML Sitemap' /><T k='schemaEnabled' l='Schema Markup' /><T k='openGraphEnabled' l='Open Graph' /></div>
      </div>
      <button onClick={save} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'12px',padding:'14px',fontWeight:700,cursor:'pointer',width:'100%',fontSize:'16px',marginTop:'8px'}}>{saving?'Saving...':'\ud83d\udcbe Save All Changes'}</button>
    </div>
  )
}