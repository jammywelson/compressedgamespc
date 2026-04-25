'use client'
import { useState, useEffect } from 'react'
const DEFS:Record<string,any>={siteName:'CompressedGamesPC',tagline:'Free Highly Compressed PC Games',navBg:'#1a1f3c',navbarHeight:'52',searchWidth:'360',searchPosition:'left',showCatsBar:true,showSearchBar:true,showAnnouncement:true,showHotButton:true,announcementText:'All games are highly compressed',announcementBg:'#4f46e5',accentColor:'#4f46e5',accentColor2:'#e53935',bodyBg:'#f0f2f8',footerBg:'#1a1f3c',footerText:'(C) 2026 CompressedGamesPC.com',footerAbout:'Your #1 source for highly compressed PC games.',socialFacebook:'',socialTelegram:'',socialYoutube:'',socialDiscord:'',hotLabel:'HOT',newLabel:'NEW',showRating:true,showDownloadCount:true,showCompressedBadge:true,showAbout:true,showContact:true,showPrivacy:true,showDisclaimer:true,showDmca:true,showTerms:true,footerShowBrand:true,footerShowCats1:true,footerShowCats2:true,footerShowLinks:true,footerShowCopyright:true,footerShowSocial:true}
export default function AppearancePage() {
  const [cfg, setCfg] = useState<Record<string,any>>(DEFS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('navbar')
  useEffect(()=>{fetch('/api/settings?key=appearance&t='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d&&typeof d==='object')setCfg(p=>({...p,...d}))}).catch(()=>{}).finally(()=>setLoading(false))},[])
  const set=(k:string,v:any)=>setCfg(p=>({...p,[k]:v}))
  const save=async()=>{setSaving(true);try{const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'appearance',value:cfg})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}}catch{alert('Save failed!')}setSaving(false)}
  const inp:any={width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff'}
  const card:any={background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'16px',border:'1px solid #e2e8f0'}
  const lbl:any={display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}
  const g2:any={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}
  const g3:any={display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}
  const Tog=({k,label}:{k:string,label:string})=>(
    <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',padding:'8px 14px',border:'2px solid',borderColor:cfg[k]?'#6366f1':'#e2e8f0',borderRadius:'8px',background:cfg[k]?'#f5f3ff':'#fff',userSelect:'none' as any}}>
      <input type="checkbox" checked={!!cfg[k]} onChange={(e:any)=>set(k,e.target.checked)} style={{width:'15px',height:'15px',accentColor:'#6366f1'} as any}/>
      <span style={{fontSize:'13px',fontWeight:500,color:cfg[k]?'#6366f1':'#6b7280'}}>{label}</span>
    </label>
  )
  const Col=({k,label}:{k:string,label:string})=>(
    <div><label style={lbl}>{label}</label>
      <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
        <input type="color" value={cfg[k]||'#000000'} onChange={(e:any)=>set(k,e.target.value)} style={{width:'44px',height:'38px',border:'1px solid #e2e8f0',borderRadius:'8px',cursor:'pointer',padding:'2px',flexShrink:0}}/>
        <input style={inp} value={cfg[k]||''} onChange={(e:any)=>set(k,e.target.value)}/>
      </div>
    </div>
  )
  const TABS=[{id:'navbar',l:'Navbar'},{id:'colors',l:'Colors'},{id:'identity',l:'Identity'},{id:'footer',l:'Footer'},{id:'social',l:'Social'},{id:'gamecards',l:'Game Cards'}]
  if(loading) return <div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Loading settings...</div>
  return (
    <div style={{padding:'20px',maxWidth:'960px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap' as any,gap:'12px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:700}}>Appearance</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>Saved to DB!</span>}
          <a href="/" target="_blank" style={{background:'#f3f4f6',color:'#374151',borderRadius:'8px',padding:'10px 16px',fontWeight:600,fontSize:'14px',textDecoration:'none'}}>Preview</a>
          <button onClick={save} disabled={saving} style={{background:saving?'#818cf8':'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>{saving?'Saving...':'Save Changes'}</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'6px',marginBottom:'20px',flexWrap:'wrap' as any}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'8px 16px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'13px',background:tab===t.id?'#6366f1':'#f3f4f6',color:tab===t.id?'#fff':'#374151'}}>{t.l}</button>)}
      </div>
      {tab==='navbar'&&(<>
        <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Navbar Size</h3>
          <div style={g3}>
            <div><label style={lbl}>Height</label><select style={inp} value={cfg.navbarHeight} onChange={(e:any)=>set('navbarHeight',e.target.value)}><option value="44">Small</option><option value="52">Normal</option><option value="64">Large</option><option value="72">XL</option></select></div>
            <div><label style={lbl}>Search Width</label><select style={inp} value={cfg.searchWidth} onChange={(e:any)=>set('searchWidth',e.target.value)}><option value="200">Small</option><option value="360">Normal</option><option value="500">Large</option><option value="100%">Full</option></select></div>
            <div><label style={lbl}>Search Position</label><select style={inp} value={cfg.searchPosition} onChange={(e:any)=>set('searchPosition',e.target.value)}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
          </div>
        </div>
        <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Show / Hide</h3>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap' as any}}><Tog k="showCatsBar" label="Categories Bar"/><Tog k="showSearchBar" label="Search Bar"/><Tog k="showAnnouncement" label="Announcement Bar"/><Tog k="showHotButton" label="Hot Button"/></div>
        </div>
        <div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Announcement Bar</h3>
          <div style={g2}>
            <div><label style={lbl}>Text</label><input style={inp} value={cfg.announcementText} onChange={(e:any)=>set('announcementText',e.target.value)}/></div>
            <div><label style={lbl}>Hot Label</label><input style={inp} value={cfg.hotLabel} onChange={(e:any)=>set('hotLabel',e.target.value)}/></div>
          </div>
        </div>
      </>)}
      {tab==='colors'&&(<div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Colors</h3>
        <div style={g3}><Col k="navBg" label="Navbar BG"/><Col k="accentColor" label="Primary Accent"/><Col k="accentColor2" label="Secondary Accent"/><Col k="announcementBg" label="Announcement BG"/><Col k="bodyBg" label="Page BG"/><Col k="footerBg" label="Footer BG"/></div>
      </div>)}
      {tab==='identity'&&(<div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Site Identity</h3>
        <div style={g2}>
          <div><label style={lbl}>Site Name</label><input style={inp} value={cfg.siteName} onChange={(e:any)=>set('siteName',e.target.value)}/></div>
          <div><label style={lbl}>Tagline</label><input style={inp} value={cfg.tagline} onChange={(e:any)=>set('tagline',e.target.value)}/></div>
        </div>
      </div>)}
      {tab==='footer'&&(<>
        <div style={card}><h3 style={{margin:'0 0 14px',fontWeight:700}}>Footer Content</h3>
          <div style={g2}>
            <div><label style={lbl}>Copyright Text</label><input style={inp} value={cfg.footerText} onChange={(e:any)=>set('footerText',e.target.value)}/></div>
            <div><label style={lbl}>About Text</label><input style={inp} value={cfg.footerAbout} onChange={(e:any)=>set('footerAbout',e.target.value)}/></div>
          </div>
        </div>
        <div style={card}><h3 style={{margin:'0 0 14px',fontWeight:700}}>Footer Sections</h3>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap' as any}}><Tog k="footerShowBrand" label="Brand"/><Tog k="footerShowCats1" label="Games"/><Tog k="footerShowCats2" label="More Games"/><Tog k="footerShowLinks" label="Quick Links"/><Tog k="footerShowCopyright" label="Copyright"/><Tog k="footerShowSocial" label="Social"/></div>
        </div>
        <div style={card}><h3 style={{margin:'0 0 14px',fontWeight:700}}>Footer Pages</h3>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap' as any}}><Tog k="showAbout" label="About"/><Tog k="showContact" label="Contact"/><Tog k="showPrivacy" label="Privacy"/><Tog k="showDisclaimer" label="Disclaimer"/><Tog k="showDmca" label="DMCA"/><Tog k="showTerms" label="Terms"/></div>
        </div>
        <div style={card}><h3 style={{margin:'0 0 14px',fontWeight:700}}>Footer Colors</h3>
          <div style={g2}><Col k="footerBg" label="Footer Background"/><Col k="accentColor" label="Accent Color"/></div>
        </div>
      </>)}
      {tab==='social'&&(<div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Social Media</h3>
        <div style={g2}>
          <div><label style={lbl}>Facebook</label><input style={inp} value={cfg.socialFacebook} onChange={(e:any)=>set('socialFacebook',e.target.value)} placeholder="https://facebook.com/..."/></div>
          <div><label style={lbl}>Telegram</label><input style={inp} value={cfg.socialTelegram} onChange={(e:any)=>set('socialTelegram',e.target.value)} placeholder="https://t.me/..."/></div>
          <div><label style={lbl}>YouTube</label><input style={inp} value={cfg.socialYoutube} onChange={(e:any)=>set('socialYoutube',e.target.value)} placeholder="https://youtube.com/..."/></div>
          <div><label style={lbl}>Discord</label><input style={inp} value={cfg.socialDiscord} onChange={(e:any)=>set('socialDiscord',e.target.value)} placeholder="https://discord.gg/..."/></div>
        </div>
      </div>)}
      {tab==='gamecards'&&(<div style={card}><h3 style={{margin:'0 0 16px',fontWeight:700}}>Game Cards</h3>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap' as any,marginBottom:'14px'}}><Tog k="showRating" label="Rating"/><Tog k="showDownloadCount" label="Downloads"/><Tog k="showCompressedBadge" label="Badge"/></div>
        <div style={g2}>
          <div><label style={lbl}>Hot Label</label><input style={inp} value={cfg.hotLabel} onChange={(e:any)=>set('hotLabel',e.target.value)}/></div>
          <div><label style={lbl}>New Label</label><input style={inp} value={cfg.newLabel} onChange={(e:any)=>set('newLabel',e.target.value)}/></div>
        </div>
      </div>)}
      <button onClick={save} disabled={saving} style={{background:saving?'#818cf8':'#6366f1',color:'#fff',border:'none',borderRadius:'12px',padding:'14px',fontWeight:700,cursor:'pointer',width:'100%',fontSize:'16px',marginTop:'8px'}}>{saving?'Saving...':'Save All Changes'}</button>
    </div>
  )
}