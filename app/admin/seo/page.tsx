'use client'
import { useState, useEffect } from 'react'

const SI: React.CSSProperties = { width:'100%', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'9px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }
const LB: React.CSSProperties = { fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }
const CARD: React.CSSProperties = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'20px', marginBottom:'16px' }

const Toggle = ({val, onChange}: {val:boolean; onChange:(v:boolean)=>void}) => (
  <div style={{position:'relative',width:'44px',height:'24px',cursor:'pointer',flexShrink:0}} onClick={()=>onChange(!val)}>
    <div style={{width:'44px',height:'24px',borderRadius:'12px',background:val?'#4f46e5':'#d1d5db',transition:'background .2s'}}/>
    <div style={{position:'absolute',top:'4px',left:val?'23px':'4px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .2s'}}/>
  </div>
)

export default function SeoPage() {
  const [saved, setSaved] = useState(false)
  const [gamesCount, setGamesCount] = useState(0)
  const [seo, setSeo] = useState({
    siteTitle: 'CompressedGamesPC - Free Highly Compressed PC Games',
    siteDesc:  'Download highly compressed PC games for free. Direct download links, no surveys. Save your bandwidth!',
    siteKeywords: 'highly compressed pc games, compressed games download, free pc games, highly compressed',
    ogImage: '', googleVerify: '', bingVerify: '',
    robotsIndex: true, robotsFollow: true,
    showIndGames: true, showCatPages: true, showHotPage: true,
    showAbout: true, showContact: true, showPrivacy: true, showDisclaimer: true, showDmca: true,
  })

  useEffect(() => {
    try {
      fetch('/api/settings?key=seo').then(r=>r.json()).then(d=>{ if(d) setSeo(x=>({...x,...d})) }).catch(()=>{
        const s = localStorage.getItem('cgpc_seo')
        if (s) try { setSeo(x=>({...x,...JSON.parse(s)})) } catch(e) {}
      })
    } catch(e) {}
    fetch('/api/games').then(r=>r.json()).then((g:any[])=>{ if(Array.isArray(g)) setGamesCount(g.length) }).catch(()=>{})
  }, [])

  const upd = (k: string, v: any) => setSeo(x=>({...x,[k]:v}))
  const save = async () => {
    localStorage.setItem('cgpc_seo', JSON.stringify(seo))
    try {
      await fetch('/api/settings', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ key:'seo', value:seo })
      })
    } catch(e) {}
    setSaved(true); setTimeout(()=>setSaved(false),2500)
  }

  return (
    <div style={{ background:'#f0f2f8', minHeight:'100vh' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:'54px', display:'flex', alignItems:'center' }}>
        <span style={{ fontSize:'18px', fontWeight:700, color:'#111827' }}>SEO Settings</span>
        <button onClick={save} style={{ marginLeft:'auto', background:saved?'#16a34a':'#4f46e5', color:'#fff', border:'none', borderRadius:'7px', padding:'8px 20px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
          {saved?'✓ Saved!':'Save Changes'}
        </button>
      </div>

      <div style={{ padding:'24px', maxWidth:'800px' }}>
        <div style={CARD}>
          <div style={{ fontSize:'15px', fontWeight:700, color:'#111827', marginBottom:'14px', paddingBottom:'10px', borderBottom:'1px solid #f3f4f6' }}>Global SEO</div>
          <div style={{ display:'grid', gap:'14px' }}>
            <div><label style={LB}>Site Title</label><input style={SI} value={seo.siteTitle} onChange={e=>upd('siteTitle',e.target.value)}/><div style={{ fontSize:'11px', color:seo.siteTitle.length>60?'#e53935':'#9ca3af', marginTop:'2px' }}>{seo.siteTitle.length}/60</div></div>
            <div><label style={LB}>Meta Description</label><textarea style={{ ...SI, minHeight:'80px', resize:'vertical' as any }} value={seo.siteDesc} onChange={e=>upd('siteDesc',e.target.value)}/><div style={{ fontSize:'11px', color:seo.siteDesc.length>160?'#e53935':'#9ca3af', marginTop:'2px' }}>{seo.siteDesc.length}/160</div></div>
            <div><label style={LB}>Focus Keywords</label><input style={SI} value={seo.siteKeywords} onChange={e=>upd('siteKeywords',e.target.value)}/></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div><label style={LB}>Google Verification</label><input style={SI} value={seo.googleVerify} onChange={e=>upd('googleVerify',e.target.value)} placeholder="google-site-verification=..."/></div>
              <div><label style={LB}>Bing Verification</label><input style={SI} value={seo.bingVerify} onChange={e=>upd('bingVerify',e.target.value)} placeholder="msvalidate.01=..."/></div>
            </div>
          </div>
        </div>

        <div style={CARD}>
          <div style={{ fontSize:'15px', fontWeight:700, color:'#111827', marginBottom:'14px', paddingBottom:'10px', borderBottom:'1px solid #f3f4f6' }}>
            Sitemap Control
          </div>
          <div style={{ background:'#eef2ff', borderRadius:'8px', padding:'12px', marginBottom:'14px', fontSize:'13px', color:'#4f46e5' }}>
            🗺 Sitemap URL: <strong>compressedgamespc.com/sitemap.xml</strong> — Google Search Console mein submit karo
          </div>
          <div style={{ background:'#f0fdf4', borderRadius:'8px', padding:'12px', marginBottom:'14px', fontSize:'13px', color:'#16a34a' }}>
            ✓ Homepage &nbsp;&nbsp; ✓ All Games &nbsp;&nbsp; ✓ {gamesCount} Game pages &nbsp;&nbsp; ✓ 14 Category pages
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {[
              {k:'showIndGames', l:'Game Pages',    d:`${gamesCount} pages`},
              {k:'showCatPages', l:'Category Pages',d:'14 categories'},
              {k:'showHotPage',  l:'Hot Games Page', d:'1 page'},
              {k:'showAbout',    l:'About Us',       d:'Static'},
              {k:'showPrivacy',  l:'Privacy Policy', d:'Static'},
              {k:'showDmca',     l:'DMCA',           d:'Static'},
            ].map(f=>(
              <div key={f.k} style={{ background:'#f9fafb', borderRadius:'8px', padding:'10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div><div style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>{f.l}</div><div style={{ fontSize:'11px', color:'#6b7280' }}>{f.d}</div></div>
                <Toggle val={(seo as any)[f.k]} onChange={v=>upd(f.k,v)}/>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'10px', marginTop:'14px' }}>
            <button onClick={save} style={{ background:'#4f46e5', color:'#fff', border:'none', borderRadius:'7px', padding:'9px 20px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Save Sitemap Settings</button>
            <a href="/sitemap.xml" target="_blank" style={{ background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0', borderRadius:'7px', padding:'9px 16px', fontSize:'13px', fontWeight:500, textDecoration:'none' }}>View Sitemap ↗</a>
          </div>
        </div>
      </div>
    </div>
  )
}
