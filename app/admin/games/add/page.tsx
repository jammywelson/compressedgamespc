'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SI: React.CSSProperties = { width:'100%', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'9px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }
const LB: React.CSSProperties = { fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }
const CARD: React.CSSProperties = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'20px', marginBottom:'16px' }
const DEFAULT_CATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games','Action RPG']

interface Mirror { label: string; url: string }

export default function AddGamePage() {
  const router  = useRouter()
  const [saving, setSaving]   = useState(false)
  const [saved,  setSaved]    = useState(false)
  const [error,  setError]    = useState('')
  const [tab,    setTab]      = useState('basic')
  const [mirrors, setMirrors] = useState<Mirror[]>([{ label:'Direct Link', url:'' }])
  const [featImg, setFeatImg] = useState<string>('')
  const [screenshots, setScreenshots] = useState<string[]>([])
  const featRef  = useRef<HTMLInputElement>(null)
  const ssRef    = useRef<HTMLInputElement>(null)

  const [cats, setCats] = useState(['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games','Action RPG'])
  const [newCatName, setNewCatName] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [form, setForm] = useState({
    title:'', slug:'', category:'Action', description:'', status:'active',
    size:'', originalSize:'', rating:'4.0', featured:false,
    seoTitle:'', seoDesc:'', seoKeywords:'', altText:'',
  })

  useEffect(()=>{
    fetch('/api/settings?key=categories').then(r=>r.json()).then(d=>{
      if(d&&Array.isArray(d))setCats(d.map((x:any)=>x.name))
    }).catch(()=>{})
  },[])



  useEffect(()=>{
    fetch('/api/settings?key=categories').then(r=>r.json()).then(d=>{
      if(d&&Array.isArray(d))setCats(d.map((x:any)=>x.name))
    }).catch(()=>{})
  },[])

  const addNewCat=()=>{
    const n=newCatName.trim()
    if(!n)return
    setCats((prev:any)=>[...prev,n])
    setForm((f:any)=>({...f,category:n}))
    setNewCatName('');setShowNewCat(false)
  }

  const upd = (k: string, v: any) => setForm(f => {
    const n = { ...f, [k]: v }
    if (k==='title') {
      n.slug     = v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
      n.seoTitle = `${v} PC Game Download Free Highly Compressed`
      n.altText  = `${v} Highly Compressed PC Download`
    }
    return n
  })

  const addMirror    = () => setMirrors(m => [...m, { label:`Mirror ${m.length+1}`, url:'' }])
  const removeMirror = (i: number) => setMirrors(m => m.filter((_,idx)=>idx!==i))
  const updMirror    = (i: number, k: keyof Mirror, v: string) => setMirrors(m => m.map((x,idx)=>idx===i?{...x,[k]:v}:x))

  const handleFeatImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setFeatImg(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleScreenshots = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => setScreenshots(s => [...s, reader.result as string])
      reader.readAsDataURL(file)
    })
  }

  const removeScreenshot = (i: number) => setScreenshots(s => s.filter((_,idx)=>idx!==i))

  const saveGame = async () => {
    if (!form.title || !form.size) { setError('Title aur Size required hai'); return }
    setSaving(true); setError('')
    const validLinks = mirrors.filter(m => m.url.trim())
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:        form.title,
          slug:         form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
          category:     form.category,
          size:         form.size,
          originalSize: form.originalSize || null,
          status:       form.status,
          featured:     form.featured,
          description:  form.description || null,
          downloadLinks: validLinks.map(m => m.url),
          rating:       parseFloat(form.rating) || 4.0,
          seoTitle:     form.seoTitle || null,
          seoDesc:      form.seoDesc  || null,
          seoKeywords:  form.seoKeywords || null,
          altText:      form.altText  || null,
        })
      })
      if (!res.ok) { const e = await res.json(); setError(e.error||'Error'); setSaving(false); return }
      setSaved(true)
      setTimeout(() => router.push('/admin/games'), 1500)
    } catch(e: any) { setError(e.message); setSaving(false) }
  }

  const tabs = [
    {id:'basic',   l:'Basic Info'},
    {id:'download',l:'Size & Links'},
    {id:'seo',     l:'SEO'},
    {id:'media',   l:'Media'},
  ]

  return (
    <div style={{ background:'#f0f2f8', minHeight:'100vh' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:'54px', display:'flex', alignItems:'center', gap:'12px' }}>
        <Link href="/admin/games" style={{ color:'#6b7280', fontSize:'13px', textDecoration:'none' }}>← All Games</Link>
        <span style={{ fontSize:'18px', fontWeight:700, color:'#111827' }}>Add New Game</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:'8px', alignItems:'center' }}>
          {error && <span style={{ fontSize:'12px', color:'#e53935' }}>{error}</span>}
          <button onClick={saveGame} disabled={saving||saved}
            style={{ background:saved?'#16a34a':saving?'#9ca3af':'#4f46e5', color:'#fff', border:'none', borderRadius:'7px', padding:'8px 20px', fontSize:'13px', fontWeight:600, cursor:saving?'not-allowed':'pointer', fontFamily:'inherit' }}>
            {saved?'✓ Saved!':saving?'Saving...':'Publish Game'}
          </button>
        </div>
      </div>

      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', display:'flex' }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:'10px 16px', fontSize:'13px', cursor:'pointer', background:'transparent', border:'none', borderBottom:`2px solid ${tab===t.id?'#4f46e5':'transparent'}`, color:tab===t.id?'#4f46e5':'#6b7280', fontFamily:'inherit', fontWeight:500 }}>
            {t.l}
          </button>
        ))}
      </div>

      <div style={{ padding:'24px', maxWidth:'800px' }}>

        {/* BASIC */}
        {tab==='basic' && (
          <div style={CARD}>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#111827', marginBottom:'14px', paddingBottom:'10px', borderBottom:'1px solid #f3f4f6' }}>Basic Information</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={LB}>Game Title *</label>
                <input style={SI} value={form.title} onChange={e=>upd('title',e.target.value)} placeholder="e.g. GTA 5" autoFocus/>
              </div>
              <div>
                <label style={LB}>URL Slug</label>
                <input style={{ ...SI, color:'#6b7280' }} value={form.slug} onChange={e=>upd('slug',e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))}/>
              </div>
              <div>
                <label style={LB}>Category</label>
                <select style={{ ...SI, cursor:'pointer' }} value={form.category} onChange={e=>{ if(e.target.value==='__new__'){setShowNewCat(true)}else{upd('category',e.target.value)} }}>
                  {cats.map(c=><option key={c}>{c}</option>)}
                  <option value='__new__'>+ Add New Category</option>
                </select>
              </div>
              <div>
                <label style={LB}>Status</label>
                <select style={{ ...SI, cursor:'pointer' }} value={form.status} onChange={e=>upd('status',e.target.value)}>
                  <option value="active">Active</option>
                  <option value="hot">Hot 🔥</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', paddingTop:'18px' }}>
                <input type="checkbox" id="feat" checked={form.featured} onChange={e=>upd('featured',e.target.checked)} style={{ width:'16px', height:'16px', cursor:'pointer', accentColor:'#4f46e5' }}/>
                <label htmlFor="feat" style={{ fontSize:'13px', color:'#374151', cursor:'pointer' }}>⭐ Featured Game</label>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={LB}>Description</label>
                <textarea style={{ ...SI, minHeight:'90px', resize:'vertical' as any }} value={form.description} onChange={e=>upd('description',e.target.value)} placeholder="Game ka description..."/>
              </div>
            </div>
          </div>
        )}

        {/* SIZE & LINKS */}
        {tab==='download' && (
          <div style={CARD}>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#111827', marginBottom:'14px', paddingBottom:'10px', borderBottom:'1px solid #f3f4f6' }}>Size & Download Links</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'20px' }}>
              <div>
                <label style={LB}>Compressed Size *</label>
                <input style={SI} value={form.size} onChange={e=>upd('size',e.target.value)} placeholder="e.g. 2.5 GB"/>
              </div>
              <div>
                <label style={LB}>Original Size</label>
                <input style={SI} value={form.originalSize} onChange={e=>upd('originalSize',e.target.value)} placeholder="e.g. 95 GB (optional)"/>
              </div>
              <div>
                <label style={LB}>Rating</label>
                <select style={{ ...SI, cursor:'pointer' }} value={form.rating} onChange={e=>upd('rating',e.target.value)}>
                  {['5.0','4.5','4.0','3.5','3.0','2.5','2.0'].map(r=><option key={r} value={r}>{'★'.repeat(Math.floor(parseFloat(r)))} {r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
              <div>
                <div style={{ fontSize:'14px', fontWeight:600, color:'#111827' }}>Download / Mirror Links</div>
                <div style={{ fontSize:'11px', color:'#6b7280' }}>Optional — jitne chahein utne add karo</div>
              </div>
              <button onClick={addMirror}
                style={{ background:'#eef2ff', color:'#4f46e5', border:'1px solid #c7d2fe', borderRadius:'6px', padding:'6px 12px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit', fontWeight:500 }}>
                + Add Mirror
              </button>
            </div>

            <div style={{ display:'flex', flexDirection:'column' as any, gap:'8px' }}>
              {mirrors.map((m, i) => (
                <div key={i} style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'12px' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'130px 1fr auto', gap:'8px', alignItems:'center' }}>
                    <div>
                      <label style={{ ...LB, marginBottom:'3px' }}>Label</label>
                      <input style={SI} value={m.label} onChange={e=>updMirror(i,'label',e.target.value)} placeholder="Direct Link"/>
                    </div>
                    <div>
                      <label style={{ ...LB, marginBottom:'3px' }}>URL</label>
                      <input style={SI} value={m.url} onChange={e=>updMirror(i,'url',e.target.value)} placeholder="https://..."/>
                    </div>
                    <button onClick={()=>removeMirror(i)} disabled={mirrors.length===1}
                      style={{ background:'#fef2f2', color:'#e53935', border:'1px solid #fca5a5', borderRadius:'6px', padding:'6px 10px', fontSize:'12px', cursor:mirrors.length===1?'not-allowed':'pointer', fontFamily:'inherit', marginTop:'16px', opacity:mirrors.length===1?.4:1 }}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:'#eef2ff', borderRadius:'8px', padding:'10px 12px', marginTop:'12px', fontSize:'12px', color:'#4f46e5' }}>
              💡 Google Drive, Mega, MediaFire, Direct links — sab supported
            </div>
          </div>
        )}

        {/* SEO */}
        {tab==='seo' && (
          <div style={CARD}>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#111827', marginBottom:'14px', paddingBottom:'10px', borderBottom:'1px solid #f3f4f6' }}>SEO Settings</div>
            <div style={{ display:'grid', gap:'14px' }}>
              <div>
                <label style={LB}>SEO Title</label>
                <input style={SI} value={form.seoTitle} onChange={e=>upd('seoTitle',e.target.value)}/>
                <div style={{ fontSize:'11px', color:form.seoTitle.length>60?'#e53935':'#9ca3af', marginTop:'2px' }}>{form.seoTitle.length}/60</div>
              </div>
              <div>
                <label style={LB}>Meta Description</label>
                <textarea style={{ ...SI, minHeight:'70px', resize:'vertical' as any }} value={form.seoDesc} onChange={e=>upd('seoDesc',e.target.value)}/>
                <div style={{ fontSize:'11px', color:form.seoDesc.length>160?'#e53935':'#9ca3af', marginTop:'2px' }}>{form.seoDesc.length}/160</div>
              </div>
              <div>
                <label style={LB}>Keywords</label>
                <input style={SI} value={form.seoKeywords} onChange={e=>upd('seoKeywords',e.target.value)}/>
                {form.title && (
                  <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' as any, marginTop:'6px' }}>
                    {[`${form.title.toLowerCase()} download`,`${form.title.toLowerCase()} highly compressed`,`${form.title.toLowerCase()} pc free`].map(kw=>(
                      <button key={kw} onClick={()=>upd('seoKeywords',form.seoKeywords?form.seoKeywords+', '+kw:kw)}
                        style={{ background:'#eef2ff', color:'#4f46e5', border:'1px solid #c7d2fe', borderRadius:'4px', padding:'2px 8px', fontSize:'11px', cursor:'pointer', fontFamily:'inherit' }}>
                        + {kw}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label style={LB}>Image Alt Text</label>
                <input style={SI} value={form.altText} onChange={e=>upd('altText',e.target.value)}/>
              </div>
            </div>
          </div>
        )}

        {/* MEDIA */}
        {tab==='media' && (
          <>
            <div style={CARD}>
              <div style={{ fontSize:'15px', fontWeight:700, color:'#111827', marginBottom:'14px', paddingBottom:'10px', borderBottom:'1px solid #f3f4f6' }}>Featured Image</div>
              <input ref={featRef} type="file" accept="image/*" onChange={handleFeatImg} style={{ display:'none' }}/>
              {featImg ? (
                <div style={{ position:'relative', display:'inline-block' }}>
                  <img src={featImg} alt="featured" style={{ width:'100%', maxWidth:'400px', borderRadius:'8px', border:'1px solid #e5e7eb' }}/>
                  <button onClick={()=>setFeatImg('')}
                    style={{ position:'absolute', top:'8px', right:'8px', background:'#e53935', color:'#fff', border:'none', borderRadius:'50%', width:'26px', height:'26px', cursor:'pointer', fontSize:'12px', fontWeight:700 }}>✕</button>
                  <div style={{ marginTop:'8px' }}>
                    <button onClick={()=>featRef.current?.click()}
                      style={{ background:'#f3f4f6', color:'#374151', border:'1px solid #e5e7eb', borderRadius:'6px', padding:'6px 14px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit' }}>
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={()=>featRef.current?.click()}
                  style={{ background:'#f9fafb', border:'2px dashed #c7d2fe', borderRadius:'10px', padding:'40px', textAlign:'center' as any, cursor:'pointer' }}>
                  <div style={{ fontSize:'40px', marginBottom:'8px' }}>🖼</div>
                  <div style={{ fontSize:'14px', fontWeight:600, color:'#4f46e5', marginBottom:'4px' }}>Click to upload featured image</div>
                  <div style={{ fontSize:'11px', color:'#9ca3af' }}>JPG, PNG, WebP — 800x600px recommended</div>
                </div>
              )}
            </div>

            <div style={CARD}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px', paddingBottom:'10px', borderBottom:'1px solid #f3f4f6' }}>
                <div style={{ fontSize:'15px', fontWeight:700, color:'#111827' }}>Screenshots ({screenshots.length}/8)</div>
                <button onClick={()=>ssRef.current?.click()}
                  style={{ background:'#eef2ff', color:'#4f46e5', border:'1px solid #c7d2fe', borderRadius:'6px', padding:'6px 14px', fontSize:'12px', cursor:'pointer', fontFamily:'inherit', fontWeight:500 }}>
                  + Add Screenshots
                </button>
              </div>
              <input ref={ssRef} type="file" accept="image/*" multiple onChange={handleScreenshots} style={{ display:'none' }}/>

              {screenshots.length === 0 ? (
                <div onClick={()=>ssRef.current?.click()}
                  style={{ background:'#f9fafb', border:'2px dashed #e5e7eb', borderRadius:'10px', padding:'30px', textAlign:'center' as any, cursor:'pointer' }}>
                  <div style={{ fontSize:'32px', marginBottom:'6px' }}>📸</div>
                  <div style={{ fontSize:'13px', color:'#9ca3af' }}>Game ke screenshots add karo (optional)</div>
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'10px' }}>
                  {screenshots.map((ss,i) => (
                    <div key={i} style={{ position:'relative', borderRadius:'8px', overflow:'hidden', border:'1px solid #e5e7eb' }}>
                      <img src={ss} alt={`screenshot ${i+1}`} style={{ width:'100%', height:'100px', objectFit:'cover' as any }}/>
                      <button onClick={()=>removeScreenshot(i)}
                        style={{ position:'absolute', top:'4px', right:'4px', background:'rgba(229,57,53,.9)', color:'#fff', border:'none', borderRadius:'50%', width:'22px', height:'22px', cursor:'pointer', fontSize:'11px', fontWeight:700 }}>✕</button>
                      <div style={{ padding:'4px 6px', background:'rgba(0,0,0,.5)', position:'absolute', bottom:0, left:0, right:0, fontSize:'10px', color:'#fff' }}>Screenshot {i+1}</div>
                    </div>
                  ))}
                  {screenshots.length < 8 && (
                    <div onClick={()=>ssRef.current?.click()}
                      style={{ border:'2px dashed #e5e7eb', borderRadius:'8px', height:'100px', display:'flex', flexDirection:'column' as any, alignItems:'center', justifyContent:'center', cursor:'pointer', background:'#f9fafb', gap:'4px' }}>
                      <span style={{ fontSize:'24px' }}>+</span>
                      <span style={{ fontSize:'11px', color:'#9ca3af' }}>Add More</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {error && <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'8px', padding:'12px', marginBottom:'12px', fontSize:'13px', color:'#e53935' }}>{error}</div>}
        <button onClick={saveGame} disabled={saving||saved}
          style={{ width:'100%', background:saved?'#16a34a':saving?'#9ca3af':'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', padding:'14px', fontSize:'14px', fontWeight:700, cursor:saving?'not-allowed':'pointer', fontFamily:'inherit' }}>
          {saved?'✓ Game Saved!':saving?'Saving...':'Publish Game'}
        </button>
      </div>
    </div>
  )
}
