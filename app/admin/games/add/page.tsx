'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games','Action RPG']

export default function AddGame() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('basic')
  const [form, setForm] = useState({
    title:'', slug:'', category:'Action', tags:'', status:'draft',
    size:'', originalSize:'', version:'', developer:'', publisher:'', releaseYear:'', platform:'PC',
    description:'', excerpt:'', systemReqs:'',
    coverImage:'', gallery:'',
    downloadLinks:'', 
    featured:false, trending:false, hot:false,
    seoTitle:'', seoDesc:'', seoKeywords:'', altText:'',
    rating:'4.0',
  })

  const set = (k: string, v: any) => {
    setForm(p => {
      const next = { ...p, [k]: v }
      if (k === 'title' && !p.slug) next.slug = v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
      return next
    })
  }

  const save = async (status?: string) => {
    if (!form.title || !form.category || !form.size) return alert('Title, category and size are required')
    setSaving(true)
    const data = {
      ...form,
      status: status || form.status,
      tags: form.tags.split(',').map((t:string)=>t.trim()).filter(Boolean),
      gallery: form.gallery.split('\n').map((s:string)=>s.trim()).filter(Boolean),
      downloadLinks: form.downloadLinks.split('\n').map((s:string)=>s.trim()).filter(Boolean),
      rating: parseFloat(form.rating) || 4.0,
    }
    const r = await fetch('/api/games', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) })
    const d = await r.json()
    setSaving(false)
    if (d.id) {
      setSaved(true)
      setTimeout(() => router.push('/admin/games'), 1500)
    } else alert('Error: ' + (d.error || 'Unknown error'))
  }

  const inp: any = { width:'100%', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'9px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box', background:'#fff' }
  const card: any = { background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'16px', border:'1px solid #e2e8f0' }
  const lbl: any = { display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }
  const g2: any = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }
  const g3: any = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px' }

  const TABS = [{id:'basic',l:'Basic Info'},{id:'media',l:'Media'},{id:'download',l:'Downloads'},{id:'seo',l:'SEO'},{id:'advanced',l:'Advanced'}]

  return (
    <div style={{ padding:'20px', maxWidth:'1000px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
            <Link href="/admin/games" style={{ color:'#64748b', textDecoration:'none', fontSize:'13px' }}>\u2190 Games</Link>
          </div>
          <h1 style={{ margin:0, fontSize:'22px', fontWeight:700 }}>\u2795 Add New Game</h1>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          {saved && <span style={{ color:'#16a34a', fontWeight:700, fontSize:'14px', padding:'10px' }}>\u2713 Saved!</span>}
          <button onClick={()=>save('draft')} disabled={saving} style={{ padding:'10px 20px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontWeight:600, fontSize:'14px' }}>{saving?'Saving...':'Save Draft'}</button>
          <button onClick={()=>save('published')} disabled={saving} style={{ padding:'10px 20px', borderRadius:'8px', border:'none', background:'#6366f1', color:'#fff', cursor:'pointer', fontWeight:600, fontSize:'14px' }}>{saving?'Publishing...':'Publish'}</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'4px', marginBottom:'20px', borderBottom:'2px solid #e2e8f0', paddingBottom:'0' }}>
        {TABS.map(t => <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:'10px 18px', border:'none', background:'transparent', cursor:'pointer', fontWeight:600, fontSize:'13px', color:tab===t.id?'#6366f1':'#64748b', borderBottom:tab===t.id?'2px solid #6366f1':'2px solid transparent', marginBottom:'-2px' }}>{t.l}</button>)}
      </div>

      {tab==='basic' && (
        <>
          <div style={card}>
            <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Game Details</h3>
            <div style={{ marginBottom:'14px' }}>
              <label style={lbl}>Title *</label>
              <input style={inp} value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Enter game title..." />
            </div>
            <div style={g2}>
              <div>
                <label style={lbl}>Slug (URL)</label>
                <input style={inp} value={form.slug} onChange={e=>set('slug',e.target.value)} placeholder="game-slug" />
              </div>
              <div>
                <label style={lbl}>Status</label>
                <select style={inp} value={form.status} onChange={e=>set('status',e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Classification</h3>
            <div style={g3}>
              <div>
                <label style={lbl}>Category *</label>
                <select style={inp} value={form.category} onChange={e=>set('category',e.target.value)}>
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Platform</label>
                <select style={inp} value={form.platform} onChange={e=>set('platform',e.target.value)}>
                  <option>PC</option><option>Windows</option><option>Multi-Platform</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Rating (1-5)</label>
                <input style={inp} type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e=>set('rating',e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop:'14px' }}>
              <label style={lbl}>Tags (comma separated)</label>
              <input style={inp} value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="action, fps, shooting, multiplayer..." />
            </div>
          </div>

          <div style={card}>
            <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>File Size</h3>
            <div style={g2}>
              <div><label style={lbl}>Compressed Size *</label><input style={inp} value={form.size} onChange={e=>set('size',e.target.value)} placeholder="e.g. 500 MB" /></div>
              <div><label style={lbl}>Original Size</label><input style={inp} value={form.originalSize} onChange={e=>set('originalSize',e.target.value)} placeholder="e.g. 8 GB" /></div>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Game Info</h3>
            <div style={g2}>
              <div><label style={lbl}>Developer</label><input style={inp} value={form.developer} onChange={e=>set('developer',e.target.value)} /></div>
              <div><label style={lbl}>Publisher</label><input style={inp} value={form.publisher} onChange={e=>set('publisher',e.target.value)} /></div>
              <div><label style={lbl}>Version</label><input style={inp} value={form.version} onChange={e=>set('version',e.target.value)} /></div>
              <div><label style={lbl}>Release Year</label><input style={inp} value={form.releaseYear} onChange={e=>set('releaseYear',e.target.value)} placeholder="2024" /></div>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Description</h3>
            <div style={{ marginBottom:'14px' }}>
              <label style={lbl}>Short Excerpt</label>
              <input style={inp} value={form.excerpt} onChange={e=>set('excerpt',e.target.value)} placeholder="Brief description..." />
            </div>
            <div style={{ marginBottom:'14px' }}>
              <label style={lbl}>Full Description</label>
              <textarea style={{ ...inp, height:'150px', resize:'vertical', fontFamily:'inherit' }} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Detailed description of the game..." />
            </div>
            <div>
              <label style={lbl}>System Requirements</label>
              <textarea style={{ ...inp, height:'100px', resize:'vertical', fontFamily:'monospace', fontSize:'13px' }} value={form.systemReqs} onChange={e=>set('systemReqs',e.target.value)} placeholder="OS: Windows 10&#10;CPU: Intel i5&#10;RAM: 8 GB&#10;GPU: GTX 1060&#10;Storage: 10 GB" />
            </div>
          </div>

          <div style={{ ...card, display:'flex', gap:'16px' }}>
            <h3 style={{ margin:'0 16px 0 0', fontWeight:700, flexShrink:0 }}>Flags</h3>
            {[['featured','\u{2B50} Featured'],['trending','\u{1F525} Trending'],['hot','\u{1F321}\uFE0F Hot']].map(([k,l]) => (
              <label key={k} style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', padding:'8px 14px', border:'2px solid', borderColor:(form as any)[k]?'#6366f1':'#e2e8f0', borderRadius:'8px', background:(form as any)[k]?'#f5f3ff':'#fff', userSelect:'none' as any }}>
                <input type="checkbox" checked={!!(form as any)[k]} onChange={e=>set(k,e.target.checked)} style={{ width:'15px', height:'15px', accentColor:'#6366f1' } as any} />
                <span style={{ fontWeight:600, fontSize:'13px', color:(form as any)[k]?'#6366f1':'#6b7280' }}>{l}</span>
              </label>
            ))}
          </div>
        </>
      )}

      {tab==='media' && (
        <div style={card}>
          <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Media</h3>
          <div style={{ marginBottom:'16px' }}>
            <label style={lbl}>Cover Image URL</label>
            <input style={inp} value={form.coverImage} onChange={e=>set('coverImage',e.target.value)} placeholder="https://..." />
            {form.coverImage && <img src={form.coverImage} alt="" style={{ marginTop:'8px', height:'120px', borderRadius:'8px', objectFit:'cover' }} onError={e=>(e.target as any).style.display='none'} />}
          </div>
          <div>
            <label style={lbl}>Gallery Image URLs (one per line)</label>
            <textarea style={{ ...inp, height:'120px', fontFamily:'monospace', fontSize:'12px' }} value={form.gallery} onChange={e=>set('gallery',e.target.value)} placeholder="https://image1.jpg&#10;https://image2.jpg&#10;https://image3.jpg" />
          </div>
        </div>
      )}

      {tab==='download' && (
        <div style={card}>
          <h3 style={{ margin:'0 0 8px', fontWeight:700 }}>Download Links</h3>
          <p style={{ margin:'0 0 16px', fontSize:'13px', color:'#64748b' }}>One download link per line. Supports direct links, Google Drive, MEGA, etc.</p>
          <textarea style={{ ...inp, height:'200px', fontFamily:'monospace', fontSize:'13px' }} value={form.downloadLinks} onChange={e=>set('downloadLinks',e.target.value)} placeholder="https://download1.com/game.zip&#10;https://drive.google.com/file/...&#10;https://mega.nz/..." />
        </div>
      )}

      {tab==='seo' && (
        <div style={card}>
          <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>SEO Settings</h3>
          <div style={{ marginBottom:'14px' }}><label style={lbl}>SEO Title</label><input style={inp} value={form.seoTitle} onChange={e=>set('seoTitle',e.target.value)} placeholder="Leave empty to use game title" /></div>
          <div style={{ marginBottom:'14px' }}><label style={lbl}>Meta Description</label><textarea style={{ ...inp, height:'80px' }} value={form.seoDesc} onChange={e=>set('seoDesc',e.target.value)} /></div>
          <div style={{ marginBottom:'14px' }}><label style={lbl}>Keywords</label><input style={inp} value={form.seoKeywords} onChange={e=>set('seoKeywords',e.target.value)} /></div>
          <div><label style={lbl}>Image Alt Text</label><input style={inp} value={form.altText} onChange={e=>set('altText',e.target.value)} /></div>
        </div>
      )}

      {tab==='advanced' && (
        <div style={card}>
          <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Advanced Settings</h3>
          <p style={{ color:'#94a3b8', fontSize:'14px' }}>Custom fields and advanced options coming soon.</p>
        </div>
      )}

      <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end', marginTop:'8px' }}>
        <button onClick={()=>save('draft')} disabled={saving} style={{ padding:'12px 24px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontWeight:600 }}>Save Draft</button>
        <button onClick={()=>save('published')} disabled={saving} style={{ padding:'12px 24px', borderRadius:'8px', border:'none', background:'#6366f1', color:'#fff', cursor:'pointer', fontWeight:700 }}>{saving?'Saving...':'\u2713 Publish Game'}</button>
      </div>
    </div>
  )
}