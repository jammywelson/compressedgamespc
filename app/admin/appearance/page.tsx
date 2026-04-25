'use client'
import { useState, useEffect } from 'react'

interface HomeSection { id:string; label:string; enabled:boolean; title:string; showCount:number; showViewAll:boolean }
interface StatItem { id:string; label:string; value:string; color:string; enabled:boolean }

const inp: React.CSSProperties = { width:'100%', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'9px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }
const lbl: React.CSSProperties = { fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }
const card: React.CSSProperties = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 3px rgba(0,0,0,.05)' }
const sTitle: React.CSSProperties = { fontFamily:'system-ui', fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'16px', paddingBottom:'10px', borderBottom:'1px solid #f3f4f6' }

const STORAGE_KEY = 'cgpc_appearance'

const DEFAULTS = {
  // Site Identity
  siteName:'CompressedGamesPC', tagline:'Free Highly Compressed PC Games',
  // Navbar
  navbarHeight:'52', logoSize:'normal', searchWidth:'360', searchPosition:'left',
  showCatsBar:true, showSearchBar:true, showAnnouncement:true, showHotButton:true,
  announcementText:'🎮 All games are highly compressed — Save your bandwidth!',
  announcementBg:'#4f46e5',
  // Colors
  navBg:'#1a1f3c', accentColor:'#4f46e5', accentColor2:'#e53935', bodyBg:'#f0f2f8',
  // Footer
  footerBg:'#1a1f3c', footerText:`© ${new Date().getFullYear()} CompressedGamesPC.com`, footerAbout:'Your #1 source for highly compressed PC games.',
  // Social
  socialFacebook:'', socialTelegram:'', socialYoutube:'', socialDiscord:'',
  // Cards
  hotLabel:'HOT', newLabel:'NEW', showRating:true, showDownloadCount:true, showCompressedBadge:true,
  // Game Page
  bannerEnabled:true, bannerHeight:'280', showUserReviews:true, downloadBtnPlacement:'top',
  // Pages
  showAbout:true, showContact:true, showPrivacy:true, showDisclaimer:true, showDmca:true, showTerms:true,
}

export default function AppearancePage() {
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('navbar')
  const [s, setS] = useState(DEFAULTS)

  const [sections, setSections] = useState<HomeSection[]>([
    { id:'hero',   label:'Hero/Featured Section', enabled:true,  title:'Featured',              showCount:1,  showViewAll:false },
    { id:'stats',  label:'Stats Bar',              enabled:true,  title:'Stats',                 showCount:5,  showViewAll:false },
    { id:'new',    label:'New Games Scroll',       enabled:true,  title:'New Compressed Games',  showCount:8,  showViewAll:true  },
    { id:'top',    label:'Top Downloads',          enabled:true,  title:'Top Downloads',         showCount:5,  showViewAll:false },
    { id:'latest', label:'Latest Games Grid',      enabled:true,  title:'Latest Games',          showCount:8,  showViewAll:true  },
    { id:'all',    label:'All Games',              enabled:true,  title:'All Games',             showCount:12, showViewAll:false },
  ])

  const [stats, setStats] = useState<StatItem[]>([
    { id:'1', label:'Total Games',    value:'1000+', color:'#4f46e5', enabled:true },
    { id:'2', label:'Avg Compression',value:'75%',   color:'#16a34a', enabled:true },
    { id:'3', label:'Always Free',    value:'Free',  color:'#ea580c', enabled:true },
    { id:'4', label:'No Surveys',     value:'100%',  color:'#0891b2', enabled:true },
  ])

  useEffect(() => {
    // Try DB first, fallback to localStorage
    fetch('/api/settings?key=appearance')
      .then(r=>r.json())
      .then(d=>{ if(d) { setS({...DEFAULTS,...d}); localStorage.setItem(STORAGE_KEY,JSON.stringify(d)) } })
      .catch(()=>{
        try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) setS({...DEFAULTS, ...JSON.parse(saved)})
        } catch(e) {}
      })
  }, [])

  const upd = (k: string, v: any) => setS(x => ({...x, [k]:v}))
  const updSec = (id: string, k: string, v: any) => setSections(ss => ss.map(x => x.id===id?{...x,[k]:v}:x))
  const updStat = (id: string, k: string, v: any) => setStats(ss => ss.map(x => x.id===id?{...x,[k]:v}:x))
  const moveSec = (id: string, dir: -1|1) => setSections(ss => {
    const idx = ss.findIndex(x=>x.id===id)
    if((dir===-1&&idx===0)||(dir===1&&idx===ss.length-1)) return ss
    const arr=[...ss]; [arr[idx],arr[idx+dir]]=[arr[idx+dir],arr[idx]]; return arr
  })

  const saveAll = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ key: 'appearance', value: s })
      })
    } catch(e) {}
    setSaved(true); setTimeout(()=>setSaved(false),2500)
  }

  const Toggle = ({val, onChange}: {val:boolean; onChange:(v:boolean)=>void}) => (
    <div style={{position:'relative',width:'44px',height:'24px',cursor:'pointer',flexShrink:0}} onClick={()=>onChange(!val)}>
      <div style={{width:'44px',height:'24px',borderRadius:'12px',background:val?'#4f46e5':'#d1d5db',transition:'background .2s'}}/>
      <div style={{position:'absolute',top:'4px',left:val?'23px':'4px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .2s'}}/>
    </div>
  )

  const tabs = [
    {id:'navbar',   l:'Navbar'},
    {id:'colors',   l:'Colors'},
    {id:'homepage', l:'Homepage'},
    {id:'statsbar', l:'Stats Bar'},
    {id:'gamepage', l:'Game Page'},
    {id:'cards',    l:'Game Cards'},
    {id:'footer',   l:'Footer'},
    {id:'social',   l:'Social'},
  ]

  return (
    <div>
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:'54px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontFamily:'system-ui',fontSize:'18px',fontWeight:700,color:'#111827'}}>Appearance & Customization</span>
        <div style={{marginLeft:'auto',display:'flex',gap:'8px'}}>
          <a href="/" target="_blank" style={{background:'#f3f4f6',color:'#374151',borderRadius:'7px',padding:'8px 14px',fontSize:'13px',textDecoration:'none'}}>Preview ↗</a>
          <button onClick={saveAll} style={{background:saved?'#16a34a':'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'8px 20px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
            {saved?'✓ Saved!':'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',display:'flex',overflowX:'auto' as any}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{padding:'10px 14px',fontSize:'12px',cursor:'pointer',background:'transparent',border:'none',borderBottom:`2px solid ${activeTab===t.id?'#4f46e5':'transparent'}`,color:activeTab===t.id?'#4f46e5':'#6b7280',fontFamily:'inherit',fontWeight:500,whiteSpace:'nowrap' as any}}>
            {t.l}
          </button>
        ))}
      </div>

      <div style={{padding:'24px',maxWidth:'900px'}}>

        {/* NAVBAR TAB */}
        {activeTab==='navbar' && (<>
          <div style={card}>
            <div style={sTitle}>Site Identity</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              <div><label style={lbl}>Site Name</label><input style={inp} value={s.siteName} onChange={e=>upd('siteName',e.target.value)}/></div>
              <div><label style={lbl}>Tagline</label><input style={inp} value={s.tagline} onChange={e=>upd('tagline',e.target.value)}/></div>
              <div>
                <label style={lbl}>Logo Upload</label>
                <div style={{background:'#f9fafb',border:'1px dashed #d1d5db',borderRadius:'7px',padding:'18px',textAlign:'center' as any,cursor:'pointer'}}>
                  <div style={{fontSize:'22px'}}>🖼</div>
                  <div style={{fontSize:'12px',color:'#6b7280',marginTop:'4px'}}>Click to upload logo</div>
                  <div style={{fontSize:'10px',color:'#9ca3af'}}>PNG, SVG — max 500KB</div>
                </div>
              </div>
              <div>
                <label style={lbl}>Favicon</label>
                <div style={{background:'#f9fafb',border:'1px dashed #d1d5db',borderRadius:'7px',padding:'18px',textAlign:'center' as any,cursor:'pointer'}}>
                  <div style={{fontSize:'22px'}}>⭐</div>
                  <div style={{fontSize:'12px',color:'#6b7280',marginTop:'4px'}}>Upload favicon</div>
                  <div style={{fontSize:'10px',color:'#9ca3af'}}>ICO/PNG 32x32px</div>
                </div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={sTitle}>Navbar Size & Layout</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              <div>
                <label style={lbl}>Navbar Height</label>
                <select style={{...inp,cursor:'pointer'}} value={s.navbarHeight} onChange={e=>upd('navbarHeight',e.target.value)}>
                  <option value="44">Small (44px)</option>
                  <option value="52">Normal (52px)</option>
                  <option value="64">Large (64px)</option>
                  <option value="72">Extra Large (72px)</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Logo Size</label>
                <select style={{...inp,cursor:'pointer'}} value={s.logoSize} onChange={e=>upd('logoSize',e.target.value)}>
                  <option value="small">Small</option>
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Search Bar Width</label>
                <select style={{...inp,cursor:'pointer'}} value={s.searchWidth} onChange={e=>upd('searchWidth',e.target.value)}>
                  <option value="200">Small (200px)</option>
                  <option value="360">Normal (360px)</option>
                  <option value="500">Large (500px)</option>
                  <option value="100%">Full Width</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Search Bar Position</label>
                <select style={{...inp,cursor:'pointer'}} value={s.searchPosition} onChange={e=>upd('searchPosition',e.target.value)}>
                  <option value="left">Left (logo ke baad)</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={sTitle}>Navbar Items Show / Hide</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {[
                {k:'showCatsBar',    l:'Categories Bar',    d:'All, Action, Sports tabs'},
                {k:'showSearchBar',  l:'Search Bar',        d:'Search input in navbar'},
                {k:'showAnnouncement',l:'Announcement Bar', d:'Top purple banner'},
                {k:'showHotButton',  l:'Hot 🔥 Button',    d:'Red button in navbar'},
              ].map(f=>(
                <div key={f.k} style={{background:'#f9fafb',borderRadius:'8px',padding:'12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:600,color:'#111827'}}>{f.l}</div>
                    <div style={{fontSize:'11px',color:'#6b7280',marginTop:'1px'}}>{f.d}</div>
                  </div>
                  <Toggle val={(s as any)[f.k]} onChange={v=>upd(f.k,v)}/>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={sTitle}>Announcement Bar</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              <div style={{gridColumn:'1/-1'}}>
                <label style={lbl}>Announcement Text</label>
                <input style={inp} value={s.announcementText} onChange={e=>upd('announcementText',e.target.value)}/>
              </div>
              <div>
                <label style={lbl}>Background Color</label>
                <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                  <input type="color" value={s.announcementBg} onChange={e=>upd('announcementBg',e.target.value)} style={{width:'40px',height:'36px',border:'1px solid #e5e7eb',borderRadius:'6px',cursor:'pointer',padding:'2px'}}/>
                  <input style={{...inp,flex:1}} value={s.announcementBg} onChange={e=>upd('announcementBg',e.target.value)}/>
                </div>
              </div>
            </div>
          </div>
        </>)}

        {/* COLORS TAB */}
        {activeTab==='colors' && (
          <div style={card}>
            <div style={sTitle}>Site Colors</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              {[
                {k:'navBg',       l:'Navbar Background'},
                {k:'accentColor', l:'Primary Accent Color'},
                {k:'accentColor2',l:'Hot / Alert Color'},
                {k:'bodyBg',      l:'Page Background'},
              ].map(c=>(
                <div key={c.k}>
                  <label style={lbl}>{c.l}</label>
                  <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                    <input type="color" value={(s as any)[c.k]} onChange={e=>upd(c.k,e.target.value)} style={{width:'40px',height:'36px',border:'1px solid #e5e7eb',borderRadius:'6px',cursor:'pointer',padding:'2px'}}/>
                    <input style={{...inp,flex:1}} value={(s as any)[c.k]} onChange={e=>upd(c.k,e.target.value)}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:'14px',background:'#f9fafb',borderRadius:'8px',padding:'12px'}}>
              <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'8px',fontWeight:500}}>Preview</div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap' as any}}>
                <div style={{background:s.accentColor,color:'#fff',padding:'6px 14px',borderRadius:'6px',fontSize:'12px'}}>Primary</div>
                <div style={{background:s.accentColor2,color:'#fff',padding:'6px 14px',borderRadius:'6px',fontSize:'12px'}}>Hot</div>
                <div style={{background:s.navBg,color:'#fff',padding:'6px 14px',borderRadius:'6px',fontSize:'12px'}}>Navbar</div>
                <div style={{background:s.bodyBg,border:'1px solid #e5e7eb',color:'#374151',padding:'6px 14px',borderRadius:'6px',fontSize:'12px'}}>Page BG</div>
              </div>
            </div>
          </div>
        )}

        {/* HOMEPAGE TAB */}
        {activeTab==='homepage' && (
          <div style={card}>
            <div style={sTitle}>Homepage Sections — Edit, Reorder, Show/Hide</div>
            <div style={{background:'#1a1f3c',borderRadius:'8px',padding:'10px 14px',marginBottom:'14px'}}>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,.4)',marginBottom:'6px',textTransform:'uppercase' as any,letterSpacing:'.5px'}}>Site par order</div>
              <div style={{display:'flex',gap:'5px',flexWrap:'wrap' as any}}>
                {sections.filter(x=>x.enabled).map((x,i)=>(
                  <div key={x.id} style={{background:'rgba(255,255,255,.1)',borderRadius:'4px',padding:'4px 8px',fontSize:'11px',color:'#fff'}}>
                    {i+1}. {x.title}
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column' as any,gap:'8px'}}>
              {sections.map((sec,i)=>(
                <div key={sec.id} style={{background:sec.enabled?'#fff':'#fff5f5',border:`1.5px solid ${sec.enabled?'#e5e7eb':'#fca5a5'}`,borderRadius:'8px',padding:'12px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{display:'flex',flexDirection:'column' as any,gap:'2px',flexShrink:0}}>
                      <button onClick={()=>moveSec(sec.id,-1)} disabled={i===0} style={{background:'#f3f4f6',border:'1px solid #e5e7eb',borderRadius:'3px',width:'22px',height:'18px',cursor:i===0?'not-allowed':'pointer',fontSize:'10px',opacity:i===0?.3:1}}>↑</button>
                      <button onClick={()=>moveSec(sec.id,1)} disabled={i===sections.length-1} style={{background:'#f3f4f6',border:'1px solid #e5e7eb',borderRadius:'3px',width:'22px',height:'18px',cursor:i===sections.length-1?'not-allowed':'pointer',fontSize:'10px',opacity:i===sections.length-1?.3:1}}>↓</button>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'11px',color:'#9ca3af'}}>{sec.label}</div>
                      <input style={{...inp,fontWeight:600,fontSize:'14px',marginTop:'2px'}} value={sec.title} onChange={e=>updSec(sec.id,'title',e.target.value)} disabled={!sec.enabled}/>
                    </div>
                    {sec.id!=='hero'&&sec.id!=='stats'&&(
                      <div style={{width:'60px'}}>
                        <div style={{fontSize:'10px',color:'#6b7280',marginBottom:'2px'}}>Count</div>
                        <input style={{...inp,textAlign:'center' as any}} type="number" min="1" max="48" value={sec.showCount} onChange={e=>updSec(sec.id,'showCount',parseInt(e.target.value)||4)}/>
                      </div>
                    )}
                    <div style={{textAlign:'center' as any,flexShrink:0}}>
                      <div style={{fontSize:'10px',color:sec.enabled?'#16a34a':'#e53935',marginBottom:'4px',fontWeight:600}}>{sec.enabled?'ON':'OFF'}</div>
                      <Toggle val={sec.enabled} onChange={v=>updSec(sec.id,'enabled',v)}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATS BAR TAB */}
        {activeTab==='statsbar' && (
          <div style={card}>
            <div style={sTitle}>Stats Bar — Har Item Customize</div>
            <div style={{display:'flex',flexDirection:'column' as any,gap:'10px'}}>
              {stats.map(stat=>(
                <div key={stat.id} style={{background:stat.enabled?'#f9fafb':'#fff5f5',border:`1px solid ${stat.enabled?'#e5e7eb':'#fca5a5'}`,borderRadius:'8px',padding:'12px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto auto',gap:'10px',alignItems:'center'}}>
                    <div><label style={lbl}>Value</label><input style={inp} value={stat.value} onChange={e=>updStat(stat.id,'value',e.target.value)}/></div>
                    <div><label style={lbl}>Label</label><input style={inp} value={stat.label} onChange={e=>updStat(stat.id,'label',e.target.value)}/></div>
                    <div><label style={lbl}>Color</label><input type="color" value={stat.color} onChange={e=>updStat(stat.id,'color',e.target.value)} style={{width:'44px',height:'36px',border:'1px solid #e5e7eb',borderRadius:'6px',cursor:'pointer',padding:'2px'}}/></div>
                    <div><label style={{...lbl,textAlign:'center' as any}}>On</label><div style={{display:'flex',justifyContent:'center'}}><Toggle val={stat.enabled} onChange={v=>updStat(stat.id,'enabled',v)}/></div></div>
                  </div>
                  {stat.enabled&&<div style={{marginTop:'8px',background:'#fff',borderRadius:'6px',padding:'8px',textAlign:'center' as any}}><div style={{fontSize:'18px',fontWeight:700,color:stat.color}}>{stat.value}</div><div style={{fontSize:'11px',color:'#6b7280'}}>{stat.label}</div></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAME PAGE TAB */}
        {activeTab==='gamepage' && (
          <div style={card}>
            <div style={sTitle}>Game Detail Page Settings</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'14px'}}>
              <div>
                <label style={lbl}>Banner Height</label>
                <select style={{...inp,cursor:'pointer'}} value={s.bannerHeight} onChange={e=>upd('bannerHeight',e.target.value)}>
                  <option value="0">Hidden</option>
                  <option value="160">Small (160px)</option>
                  <option value="220">Medium (220px)</option>
                  <option value="280">Large (280px)</option>
                  <option value="360">Extra Large (360px)</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Download Button Placement</label>
                <select style={{...inp,cursor:'pointer'}} value={s.downloadBtnPlacement} onChange={e=>upd('downloadBtnPlacement',e.target.value)}>
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {[
                {k:'bannerEnabled',     l:'Show Banner',          d:'Game page top banner'},
                {k:'showUserReviews',   l:'User Reviews',         d:'Review form on game page'},
              ].map(f=>(
                <div key={f.k} style={{background:'#f9fafb',borderRadius:'8px',padding:'12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div><div style={{fontSize:'13px',fontWeight:600,color:'#111827'}}>{f.l}</div><div style={{fontSize:'11px',color:'#6b7280'}}>{f.d}</div></div>
                  <Toggle val={(s as any)[f.k]} onChange={v=>upd(f.k,v)}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CARDS TAB */}
        {activeTab==='cards' && (
          <div style={card}>
            <div style={sTitle}>Game Cards Settings</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px'}}>
              <div><label style={lbl}>Hot Badge Label</label><input style={inp} value={s.hotLabel} onChange={e=>upd('hotLabel',e.target.value)}/></div>
              <div><label style={lbl}>New Badge Label</label><input style={inp} value={s.newLabel} onChange={e=>upd('newLabel',e.target.value)}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {[
                {k:'showRating',         l:'Star Ratings',        d:'Stars on game cards'},
                {k:'showDownloadCount',  l:'Download Count',      d:'X downloads shown'},
                {k:'showCompressedBadge',l:'Compressed Badge',    d:'✓ COMPRESSED label'},
              ].map(f=>(
                <div key={f.k} style={{background:'#f9fafb',borderRadius:'8px',padding:'12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div><div style={{fontSize:'13px',fontWeight:600,color:'#111827'}}>{f.l}</div><div style={{fontSize:'11px',color:'#6b7280'}}>{f.d}</div></div>
                  <Toggle val={(s as any)[f.k]} onChange={v=>upd(f.k,v)}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER TAB */}
        {activeTab==='footer' && (<>
          <div style={card}>
            <div style={sTitle}>Footer Design</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              <div>
                <label style={lbl}>Footer Background</label>
                <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                  <input type="color" value={s.footerBg} onChange={e=>upd('footerBg',e.target.value)} style={{width:'40px',height:'36px',border:'1px solid #e5e7eb',borderRadius:'6px',cursor:'pointer',padding:'2px'}}/>
                  <input style={{...inp,flex:1}} value={s.footerBg} onChange={e=>upd('footerBg',e.target.value)}/>
                </div>
              </div>
              <div><label style={lbl}>Copyright Text</label><input style={inp} value={s.footerText} onChange={e=>upd('footerText',e.target.value)}/></div>
              <div style={{gridColumn:'1/-1'}}><label style={lbl}>About Text</label><textarea style={{...inp,minHeight:'70px',resize:'vertical' as any}} value={s.footerAbout} onChange={e=>upd('footerAbout',e.target.value)}/></div>
            </div>
          </div>
          <div style={card}>
            <div style={sTitle}>Footer Columns — Kaunse Show Karen</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'16px'}}>
              {[
                {k:'footerShowBrand',   l:'Brand / About Column', d:'Logo, description, social buttons'},
                {k:'footerShowCats1',   l:'Categories Column 1',  d:'Action, Fighting, Strategy...'},
                {k:'footerShowCats2',   l:'Categories Column 2',  d:'Sci-Fi, Survival, Puzzle...'},
                {k:'footerShowLinks',   l:'Quick Links Column',   d:'Home, All Games, Hot Games'},
                {k:'footerShowCopyright',l:'Copyright Bar',       d:'Bottom copyright text'},
                {k:'footerShowSocial',  l:'Social Buttons',       d:'Facebook, Telegram etc.'},
              ].map(f=>(
                <div key={f.k} style={{background:'#f9fafb',borderRadius:'8px',padding:'12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:600,color:'#111827'}}>{f.l}</div>
                    <div style={{fontSize:'11px',color:'#6b7280',marginTop:'1px'}}>{f.d}</div>
                  </div>
                  <Toggle val={(s as any)[f.k]!==false} onChange={v=>upd(f.k,v)}/>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={sTitle}>Footer Pages — Kaunse Show Karen</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {[
                {k:'showAbout',     l:'About Us',      href:'/about'},
                {k:'showContact',   l:'Contact Us',    href:'/contact'},
                {k:'showPrivacy',   l:'Privacy Policy',href:'/privacy-policy'},
                {k:'showDisclaimer',l:'Disclaimer',    href:'/disclaimer'},
                {k:'showDmca',      l:'DMCA',          href:'/dmca'},
                {k:'showTerms',     l:'Terms of Use',  href:'/terms'},
              ].map(f=>(
                <div key={f.k} style={{background:'#f9fafb',borderRadius:'8px',padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:600,color:'#111827'}}>{f.l}</div>
                    <code style={{fontSize:'10px',color:'#9ca3af'}}>{f.href}</code>
                  </div>
                  <Toggle val={(s as any)[f.k]} onChange={v=>upd(f.k,v)}/>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={sTitle}>Footer Preview</div>
            <div style={{background:s.footerBg,borderRadius:'8px',padding:'16px'}}>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                <div>
                  <div style={{fontSize:'14px',fontWeight:700,color:'#fff',marginBottom:'6px'}}>CGP {s.siteName}</div>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',lineHeight:1.6}}>{s.footerAbout}</div>
                </div>
                <div>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',textTransform:'uppercase' as any,letterSpacing:'.5px',marginBottom:'6px'}}>Categories</div>
                  {['Action','Sports','Horror','Puzzle'].map(c=><div key={c} style={{fontSize:'11px',color:'rgba(255,255,255,.35)',marginBottom:'3px'}}>{c}</div>)}
                </div>
                <div>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',textTransform:'uppercase' as any,letterSpacing:'.5px',marginBottom:'6px'}}>Links</div>
                  {['Home','All Games','About Us','DMCA'].map(l=><div key={l} style={{fontSize:'11px',color:'rgba(255,255,255,.35)',marginBottom:'3px'}}>{l}</div>)}
                </div>
              </div>
              <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:'10px',fontSize:'11px',color:'rgba(255,255,255,.25)'}}>{s.footerText}</div>
            </div>
          </div>
        </>)}

        {/* SOCIAL TAB */}
        {activeTab==='social' && (
          <div style={card}>
            <div style={sTitle}>Social Media Links</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              {[
                {k:'socialFacebook',l:'Facebook',p:'https://facebook.com/...'},
                {k:'socialTelegram',l:'Telegram',p:'https://t.me/...'},
                {k:'socialYoutube', l:'YouTube', p:'https://youtube.com/...'},
                {k:'socialDiscord', l:'Discord', p:'https://discord.gg/...'},
              ].map(x=>(
                <div key={x.k}>
                  <label style={lbl}>{x.l}</label>
                  <input style={inp} placeholder={x.p} value={(s as any)[x.k]} onChange={e=>upd(x.k,e.target.value)}/>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={saveAll} style={{width:'100%',background:saved?'#16a34a':'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'14px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          {saved?'✓ All Changes Saved!':'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
