'use client'
import { useState, useEffect } from 'react'

const SI: React.CSSProperties = { width:'100%', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'9px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }
const LB: React.CSSProperties = { fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }

const DEFAULT_PAGES = [
  { id:'about',          title:'About Us',       slug:'about',          content:'', status:'published', showFooter:true },
  { id:'contact',        title:'Contact Us',     slug:'contact',        content:'', status:'published', showFooter:true },
  { id:'privacy-policy', title:'Privacy Policy', slug:'privacy-policy', content:'', status:'published', showFooter:true },
  { id:'disclaimer',     title:'Disclaimer',     slug:'disclaimer',     content:'', status:'published', showFooter:true },
  { id:'dmca',           title:'DMCA',           slug:'dmca',           content:'', status:'published', showFooter:true },
  { id:'terms',          title:'Terms of Use',   slug:'terms',          content:'', status:'published', showFooter:true },
]

export default function PagesPage() {
  const [pages, setPages]     = useState(DEFAULT_PAGES)
  const [active, setActive]   = useState('about')
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings?key=pages')
      .then(r=>r.json())
      .then(d=>{ if(d&&Array.isArray(d)) setPages(d) })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  }, [])

  const curr = pages.find(p=>p.id===active) || pages[0]

  const updPage = (k: string, v: any) => setPages(ps=>ps.map(p=>p.id===active?{...p,[k]:v}:p))

  const savePage = async () => {
    await fetch('/api/settings', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ key:'pages', value:pages })
    })
    setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  return (
    <div style={{background:'#f0f2f8',minHeight:'100vh'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:'54px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>Pages Manager</span>
        <button onClick={savePage} style={{marginLeft:'auto',background:saved?'#16a34a':'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'8px 20px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
          {saved?'✓ Saved!':'Save Page'}
        </button>
      </div>
      <div style={{display:'flex',height:'calc(100vh - 54px)'}}>
        {/* Sidebar */}
        <div style={{width:'200px',background:'#fff',borderRight:'1px solid #e5e7eb',padding:'12px 8px',display:'flex',flexDirection:'column' as any,gap:'4px'}}>
          {pages.map(p=>(
            <button key={p.id} onClick={()=>setActive(p.id)}
              style={{background:active===p.id?'#eef2ff':'transparent',color:active===p.id?'#4f46e5':'#374151',border:'none',borderRadius:'6px',padding:'8px 12px',textAlign:'left' as any,fontSize:'13px',cursor:'pointer',fontFamily:'inherit',fontWeight:active===p.id?600:400}}>
              {p.title}
              <span style={{fontSize:'10px',color:p.status==='published'?'#16a34a':'#6b7280',marginLeft:'6px'}}>●</span>
            </button>
          ))}
        </div>
        {/* Editor */}
        {loading ? (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#6b7280'}}>Loading...</div>
        ) : (
          <div style={{flex:1,padding:'24px',overflow:'auto'}}>
            <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',padding:'20px',maxWidth:'800px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
                <div><label style={LB}>Page Title</label><input style={SI} value={curr.title} onChange={e=>updPage('title',e.target.value)}/></div>
                <div><label style={LB}>Slug (URL)</label><input style={{...SI,color:'#6b7280'}} value={curr.slug} readOnly/></div>
                <div>
                  <label style={LB}>Status</label>
                  <select style={{...SI,cursor:'pointer'}} value={curr.status} onChange={e=>updPage('status',e.target.value)}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',paddingTop:'18px'}}>
                  <input type="checkbox" checked={curr.showFooter} onChange={e=>updPage('showFooter',e.target.checked)} style={{accentColor:'#4f46e5',cursor:'pointer'}}/>
                  <label style={{fontSize:'13px',color:'#374151',cursor:'pointer'}}>Footer mein show karo</label>
                </div>
              </div>
              <div>
                <label style={LB}>Content</label>
                <textarea
                  style={{...SI,minHeight:'350px',resize:'vertical' as any,fontFamily:'monospace',fontSize:'12px'}}
                  value={curr.content}
                  onChange={e=>updPage('content',e.target.value)}
                  placeholder={`${curr.title} ka content yahan likhein...`}
                />
                <div style={{fontSize:'11px',color:'#9ca3af',marginTop:'4px'}}>Markdown supported — # heading, **bold**, *italic*, - list</div>
              </div>
              <div style={{display:'flex',gap:'10px',marginTop:'14px'}}>
                <button onClick={savePage} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'8px 20px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                  Save Page
                </button>
                <a href={`/${curr.slug}`} target="_blank" style={{background:'#f3f4f6',color:'#374151',border:'1px solid #e5e7eb',borderRadius:'7px',padding:'8px 16px',fontSize:'13px',textDecoration:'none'}}>
                  Preview ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
