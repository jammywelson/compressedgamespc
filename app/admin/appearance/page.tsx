'use client'
import { useState, useEffect } from 'react'
export default function Page() {
  const [cfg, setCfg] = useState<Record<string,any>>({"navBg":"#1a1f3c","navbarHeight":"52","searchWidth":"360","searchPosition":"left","showCatsBar":true,"showSearchBar":true,"showAnnouncement":true,"showHotButton":true,"announcementText":"🎮 All games are highly compressed — Save your bandwidth!","announcementBg":"#4f46e5","hotLabel":"HOT","accentColor":"#4f46e5","accentColor2":"#e53935","bodyBg":"#f0f2f8","footerBg":"#1a1f3c","footerText":"© 2026 CompressedGamesPC.com","footerAbout":"Your #1 source for highly compressed PC games.","socialFacebook":"","socialTelegram":"","socialYoutube":"","socialDiscord":"","footerShowBrand":true,"footerShowCats1":true,"footerShowCats2":true,"footerShowLinks":true,"footerShowCopyright":true,"showAbout":true,"showContact":true,"showPrivacy":true,"showDisclaimer":true,"showDmca":true,"showTerms":true})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{fetch('/api/settings?key=appearance',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d&&typeof d==='object')setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);try{const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'appearance',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}}catch{alert('Save failed')}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'9px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff',fontFamily:'inherit'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const g2:any={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}
  const g3:any={display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}
  const Tog=({k,label}:{k:string,label:string})=>(<label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',padding:'9px 14px',border:'2px solid',borderColor:cfg[k]?'#6366f1':'#e2e8f0',borderRadius:'8px',background:cfg[k]?'#f5f3ff':'#fff',userSelect:'none' as any}}><input type="checkbox" checked={!!cfg[k]} onChange={(e:any)=>set(k,e.target.checked)} style={{width:'15px',height:'15px',accentColor:'#6366f1'} as any} /><span style={{fontWeight:600,fontSize:'13px',color:cfg[k]?'#6366f1':'#6b7280'}}>{label}</span></label>)
  const Col=({k,label}:{k:string,label:string})=>(<div><label style={lbl}>{label}</label><div style={{display:'flex',gap:'8px',alignItems:'center'}}><input type="color" value={cfg[k]||'#000000'} onChange={(e:any)=>set(k,e.target.value)} style={{width:'44px',height:'38px',border:'1px solid #e2e8f0',borderRadius:'8px',cursor:'pointer',padding:'2px',flexShrink:0}} /><input style={inp} value={cfg[k]||''} onChange={(e:any)=>set(k,e.target.value)} placeholder="#000000" /></div></div>)
  if(loading)return <div style={{padding:'60px',textAlign:'center',color:'#94a3b8',fontSize:'15px'}}>Loading settings...</div>
  return(
    <div style={{padding:'24px',maxWidth:'960px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:800,color:'#0f172a'}}>🎨 Appearance & Theme</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700,fontSize:'14px'}}>\u2713 Saved to Database!</span>}
          <a href="/" target="_blank" style={{background:'#f1f5f9',color:'#374151',borderRadius:'8px',padding:'9px 16px',fontWeight:600,fontSize:'13px',textDecoration:'none'}}>Preview \u2197</a>
          <button onClick={save} disabled={saving} style={{background:saving?'#818cf8':'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',fontSize:'14px',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'\u{1F4BE} Save Changes'}</button>
        </div>
      </div>
      {[['navbar','\u{1F4CC} Navbar'],['colors','\u{1F3A8} Colors'],['footer','\u{1F9B4} Footer'],['pages','\u{1F4C4} Pages']].reduce((acc,[id,label])=>acc,null)}
    <div style={{display:'flex',gap:'6px',marginBottom:'20px',flexWrap:'wrap',borderBottom:'2px solid #e2e8f0',paddingBottom:'0'}}>
      {[['navbar','\u{1F4CC} Navbar'],['colors','\u{1F3A8} Colors'],['footer','\u{1F9B4} Footer'],['pages','\u{1F4C4} Pages']].map(([id,label]:any)=>null)}
    </div>
    <div style={card}>
      <h3 style={{margin:'0 0 16px',fontWeight:700}}>Navbar</h3>
      <div style={g3}>
        <div><label style={lbl}>Height</label><select style={inp} value={cfg.navbarHeight} onChange={(e:any)=>set('navbarHeight',e.target.value)}><option value="44">Small (44px)</option><option value="52">Normal (52px)</option><option value="64">Large (64px)</option></select></div>
        <div><label style={lbl}>Search Width</label><select style={inp} value={cfg.searchWidth} onChange={(e:any)=>set('searchWidth',e.target.value)}><option value="200">Small</option><option value="360">Normal</option><option value="500">Large</option><option value="100%">Full</option></select></div>
        <div><label style={lbl}>Search Position</label><select style={inp} value={cfg.searchPosition} onChange={(e:any)=>set('searchPosition',e.target.value)}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
      </div>
      <div style={{marginTop:'14px',display:'flex',gap:'10px',flexWrap:'wrap'}}><Tog k="showSearchBar" label="Search Bar" /><Tog k="showCatsBar" label="Categories Bar" /><Tog k="showAnnouncement" label="Announcement Bar" /><Tog k="showHotButton" label="\u{1F525} Hot Button" /></div>
      <div style={{marginTop:'14px',...g2}}>
        <div><label style={lbl}>Announcement Text</label><input style={inp} value={cfg.announcementText} onChange={(e:any)=>set('announcementText',e.target.value)} /></div>
        <div><label style={lbl}>Hot Button Label</label><input style={inp} value={cfg.hotLabel} onChange={(e:any)=>set('hotLabel',e.target.value)} /></div>
      </div>
    </div>
    <div style={card}>
      <h3 style={{margin:'0 0 16px',fontWeight:700}}>Colors</h3>
      <div style={g3}><Col k="navBg" label="Navbar BG" /><Col k="accentColor" label="Primary Accent" /><Col k="accentColor2" label="Secondary" /><Col k="announcementBg" label="Announcement BG" /><Col k="bodyBg" label="Page Background" /><Col k="footerBg" label="Footer BG" /></div>
    </div>
    <div style={card}>
      <h3 style={{margin:'0 0 16px',fontWeight:700}}>Footer</h3>
      <div style={{...g2,marginBottom:'14px'}}>
        <div><label style={lbl}>Copyright Text</label><input style={inp} value={cfg.footerText} onChange={(e:any)=>set('footerText',e.target.value)} /></div>
        <div><label style={lbl}>About Text</label><input style={inp} value={cfg.footerAbout} onChange={(e:any)=>set('footerAbout',e.target.value)} /></div>
        <div><label style={lbl}>Facebook URL</label><input style={inp} value={cfg.socialFacebook} onChange={(e:any)=>set('socialFacebook',e.target.value)} placeholder="https://..." /></div>
        <div><label style={lbl}>Telegram URL</label><input style={inp} value={cfg.socialTelegram} onChange={(e:any)=>set('socialTelegram',e.target.value)} placeholder="https://..." /></div>
        <div><label style={lbl}>YouTube URL</label><input style={inp} value={cfg.socialYoutube} onChange={(e:any)=>set('socialYoutube',e.target.value)} placeholder="https://..." /></div>
        <div><label style={lbl}>Discord URL</label><input style={inp} value={cfg.socialDiscord} onChange={(e:any)=>set('socialDiscord',e.target.value)} placeholder="https://..." /></div>
      </div>
      <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}><Tog k="footerShowBrand" label="Brand Column" /><Tog k="footerShowCats1" label="Games Column" /><Tog k="footerShowCats2" label="More Games" /><Tog k="footerShowLinks" label="Quick Links" /><Tog k="footerShowCopyright" label="Copyright Bar" /></div>
    </div>
    <div style={card}>
      <h3 style={{margin:'0 0 16px',fontWeight:700}}>Footer Pages</h3>
      <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}><Tog k="showAbout" label="About" /><Tog k="showContact" label="Contact" /><Tog k="showPrivacy" label="Privacy" /><Tog k="showDisclaimer" label="Disclaimer" /><Tog k="showDmca" label="DMCA" /><Tog k="showTerms" label="Terms" /></div>
    </div>
      <button onClick={save} disabled={saving} style={{background:saving?'#818cf8':'#6366f1',color:'#fff',border:'none',borderRadius:'12px',padding:'14px',width:'100%',fontWeight:700,cursor:'pointer',fontSize:'15px',marginTop:'8px',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'\u{1F4BE} Save All Changes'}</button>
    </div>
  )
}