'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const CATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games','Action RPG']

export default function GameForm() {
  const router = useRouter()
  const params = useParams()
  const gameId = params?.id as string | undefined
  const isEdit = !!gameId

  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('basic')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    title:'', slug:'', category:'Action', tags:'', status:'draft',
    size:'', originalSize:'', version:'', developer:'', publisher:'', releaseYear:'', platform:'PC',
    description:'', excerpt:'', systemReqs:'', coverImage:'', gallery:'', downloadLinks:'',
    featured:false, trending:false, hot:false,
    seoTitle:'', seoDesc:'', seoKeywords:'', altText:'', rating:'4.0',
  })

  useEffect(() => {
    if (isEdit && gameId) {
      fetch('/api/games/' + gameId).then(r=>r.json()).then((g:any) => {
        if (g.id) setForm({
          title:g.title||'', slug:g.slug||'', category:g.category||'Action', tags:(g.tags||[]).join(', '), status:g.status||'draft',
          size:g.size||'', originalSize:g.originalSize||'', version:g.version||'', developer:g.developer||'', publisher:g.publisher||'', releaseYear:g.releaseYear||'', platform:g.platform||'PC',
          description:g.description||'', excerpt:g.excerpt||'', systemReqs:g.systemReqs||'', coverImage:g.coverImage||'',
          gallery:(g.gallery||[]).join('\n'), downloadLinks:(typeof g.downloadLinks==='string'?JSON.parse(g.downloadLinks):g.downloadLinks||[]).join('\n'),
          featured:!!g.featured, trending:!!g.trending, hot:!!g.hot,
          seoTitle:g.seoTitle||'', seoDesc:g.seoDesc||'', seoKeywords:g.seoKeywords||'', altText:g.altText||'', rating:String(g.rating||4.0),
        })
      })
    }
  }, [isEdit, gameId])

  const set = (k:string, v:any) => setForm(p => {
    const n = {...p,[k]:v}
    if (k==='title' && !isEdit && !p.slug) n.slug = v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
    return n
  })

  const save = async (status?: string) => {
    if (!form.title || !form.size) return alert('Title and size are required')
    setSaving(true)
    const data = { ...form, status: status||form.status,
      tags: form.tags.split(',').map((t:string)=>t.trim()).filter(Boolean),
      gallery: form.gallery.split('\n').map((s:string)=>s.trim()).filter(Boolean),
      downloadLinks: form.downloadLinks.split('\n').map((s:string)=>s.trim()).filter(Boolean),
      rating: parseFloat(form.rating)||4.0,
    }
    const url = isEdit ? '/api/games/' + gameId : '/api/games'
    const method = isEdit ? 'PATCH' : 'POST'
    const r = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) })
    const d = await r.json()
    setSaving(false)
    if (d.id) { setSaved(true); setTimeout(()=>{ setSaved(false); router.push('/admin/games') }, 1200) }
    else alert('Error: ' + (d.error||'Unknown'))
  }

  const inp:any = { width:'100%', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'9px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box', background:'#fff', fontFamily:'inherit' }
  const card:any = { background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'16px', border:'1px solid #e2e8f0' }
  const lbl:any = { display:'block', fontSize:'13px', fontWeight:600, color:'#374151', marginBottom:'6px' }
  const g2:any = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }
  const g3:any = { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px' }
  const TABS = [{id:'basic',l:'Basic Info'},{id:'media',l:'Media'},{id:'downloads',l:'Downloads'},{id:'seo',l:'SEO'},{id:'advanced',l:'Advanced'}]

  return (
    <div style={{ padding:'24px', maxWidth:'980px', background:'#f8fafc', minHeight:'calc(100vh - 60px)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <Link href="/admin/games" style={{ color:'#64748b', textDecoration:'none', fontSize:'13px', fontWeight:500 }}>\u2190 Back to Games</Link>
          <h1 style={{ margin:'6px 0 0', fontSize:'22px', fontWeight:800 }}>{isEdit?'\u270F\uFE0F Edit Game':'\u2795 Add New Game'}</h1>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {saved && <span style={{ color:'#16a34a', fontWeight:700 }}>\u2713 Saved!</span>}
          <button onClick={()=>save('draft')} disabled={saving} style={{ padding:'10px 18px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontWeight:600, fontSize:'14px' }}>Save Draft</button>
          <button onClick={()=>save('published')} disabled={saving} style={{ padding:'10px 20px', borderRadius:'8px', border:'none', background:'#6366f1', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:'14px', boxShadow:'0 2px 8px rgba(99,102,241,.3)' }}>{saving?'Saving...':'\u2713 Publish'}</button>
        </div>
      </div>

      <div style={{ display:'flex', gap:'0', marginBottom:'20px', borderBottom:'2px solid #e2e8f0' }}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:'10px 20px', border:'none', background:'transparent', cursor:'pointer', fontWeight:600, fontSize:'13px', color:tab===t.id?'#6366f1':'#64748b', borderBottom:tab===t.id?'2px solid #6366f1':'2px solid transparent', marginBottom:'-2px' }}>{t.l}</button>)}
      </div>

      {tab==='basic' && (<>
        <div style={card}>
          <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Game Details</h3>
          <div style={{ marginBottom:'14px' }}><label style={lbl}>Title *</label><input style={inp} value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Enter game title..." /></div>
          <div style={g2}>
            <div><label style={lbl}>Slug (URL)</label><input style={inp} value={form.slug} onChange={e=>set('slug',e.target.value)} /></div>
            <div><label style={lbl}>Status</label>
              <select style={inp} value={form.status} onChange={e=>set('status',e.target.value)}>
                <option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
        <div style={card}>
          <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Classification</h3>
          <div style={g3}>
            <div><label style={lbl}>Category *</label><select style={inp} value={form.category} onChange={e=>set('category',e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={lbl}>Platform</label><select style={inp} value={form.platform} onChange={e=>set('platform',e.target.value)}><option>PC</option><option>Windows</option><option>Multi-Platform</option></select></div>
            <div><label style={lbl}>Rating (1-5)</label><input style={inp} type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e=>set('rating',e.target.value)} /></div>
          </div>
          <div style={{ marginTop:'14px' }}><label style={lbl}>Tags (comma separated)</label><input style={inp} value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="action, fps, multiplayer..." /></div>
        </div>
        <div style={card}>
          <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>File Size</h3>
          <div style={g2}>
            <div><label style={lbl}>Compressed Size *</label><input style={inp} value={form.size} onChange={e=>set('size',e.target.value)} placeholder="500 MB" /></div>
            <div><label style={lbl}>Original Size</label><input style={inp} value={form.originalSize} onChange={e=>set('originalSize',e.target.value)} placeholder="8 GB" /></div>
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
          <div style={{ marginBottom:'14px' }}><label style={lbl}>Short Excerpt</label><input style={inp} value={form.excerpt} onChange={e=>set('excerpt',e.target.value)} /></div>
          <div style={{ marginBottom:'14px' }}><label style={lbl}>Full Description</label><textarea style={{ ...inp, height:'160px', resize:'vertical' }} value={form.description} onChange={e=>set('description',e.target.value)} /></div>
          <div><label style={lbl}>System Requirements</label><textarea style={{ ...inp, height:'100px', resize:'vertical', fontFamily:'monospace', fontSize:'13px' }} value={form.systemReqs} onChange={e=>set('systemReqs',e.target.value)} placeholder="OS: Windows 10&#10;CPU: Intel i5&#10;RAM: 8 GB&#10;GPU: GTX 1060" /></div>
        </div>
        <div style={{ ...card, display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontWeight:700, fontSize:'14px' }}>Flags:</span>
          {[['featured','\u2B50 Featured'],['trending','\u{1F525} Trending'],['hot','\u{1F321}\uFE0F Hot']].map(([k,l])=>(
            <label key={k} style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', padding:'8px 14px', border:'2px solid', borderColor:(form as any)[k]?'#6366f1':'#e2e8f0', borderRadius:'8px', background:(form as any)[k]?'#f5f3ff':'#fff', userSelect:'none' as any }}>
              <input type="checkbox" checked={!!(form as any)[k]} onChange={e=>set(k,e.target.checked)} style={{ width:'15px', height:'15px', accentColor:'#6366f1' } as any} />
              <span style={{ fontWeight:600, fontSize:'13px', color:(form as any)[k]?'#6366f1':'#6b7280' }}>{l}</span>
            </label>
          ))}
        </div>
      </>)}

      {tab==='media' && (
        <div style={card}>
          <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Media</h3>
          <div style={{ marginBottom:'16px' }}>
            <label style={lbl}>Cover Image URL</label>
            <input style={inp} value={form.coverImage} onChange={e=>set('coverImage',e.target.value)} placeholder="https://..." />
            {form.coverImage && <img src={form.coverImage} alt="" style={{ marginTop:'8px', height:'120px', borderRadius:'8px', objectFit:'cover' }} onError={e=>(e.target as any).style.display='none'} />}
          </div>
          <div><label style={lbl}>Gallery Image URLs (one per line)</label><textarea style={{ ...inp, height:'120px', fontFamily:'monospace', fontSize:'12px' }} value={form.gallery} onChange={e=>set('gallery',e.target.value)} placeholder="https://img1.jpg&#10;https://img2.jpg" /></div>
        </div>
      )}

      {tab==='downloads' && (
        <div style={card}>
          <h3 style={{ margin:'0 0 8px', fontWeight:700 }}>Download Links</h3>
          <p style={{ margin:'0 0 16px', fontSize:'13px', color:'#64748b' }}>One link per line. Supports direct, Google Drive, MEGA, etc.</p>
          <textarea style={{ ...inp, height:'200px', fontFamily:'monospace', fontSize:'13px' }} value={form.downloadLinks} onChange={e=>set('downloadLinks',e.target.value)} placeholder="https://direct-download.com/game.zip&#10;https://drive.google.com/file/...&#10;https://mega.nz/..." />
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
          <h3 style={{ margin:'0 0 16px', fontWeight:700 }}>Advanced Options</h3>
          <p style={{ color:'#94a3b8', fontSize:'14px' }}>Custom fields, scheduling, and more coming soon.</p>
        </div>
      )}

      <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end', paddingTop:'8px' }}>
        <button onClick={()=>save('draft')} disabled={saving} style={{ padding:'12px 24px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', fontWeight:600 }}>Save Draft</button>
        <button onClick={()=>save('published')} disabled={saving} style={{ padding:'12px 28px', borderRadius:'8px', border:'none', background:'#6366f1', color:'#fff', cursor:'pointer', fontWeight:700, boxShadow:'0 2px 8px rgba(99,102,241,.3)' }}>{saving?'Saving...':'\u2713 '+(isEdit?'Update':'Publish')}</button>
      </div>
    </div>
  )
}