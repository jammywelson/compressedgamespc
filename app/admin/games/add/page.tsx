'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Shooting','Sci-Fi','Survival','Puzzle','Old Games']

export default function AddGame() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [form, setForm] = useState({
    title: '', slug: '', category: 'Action', tags: '', size: '', originalSize: '', version: '',
    developer: '', publisher: '', releaseYear: '', platform: 'PC', status: 'draft',
    featured: false, trending: false,
    description: '', excerpt: '',
    coverImage: '', gallery: '',
    downloadLinks: '',
    seoTitle: '', seoDesc: '', seoKeywords: '', altText: '',
  })

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const genSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const save = async (status = form.status) => {
    if (!form.title.trim()) return alert('Title required')
    if (!form.category) return alert('Category required')
    if (!form.size.trim()) return alert('Size required')
    setSaving(true)
    try {
      const payload = {
        ...form,
        status,
        slug: form.slug || genSlug(form.title),
        tags: form.tags.split(',').map((t:string) => t.trim()).filter(Boolean),
        downloadLinks: form.downloadLinks.split('\n').map((l:string) => l.trim()).filter(Boolean),
        gallery: form.gallery.split('\n').map((l:string) => l.trim()).filter(Boolean),
      }
      const r = await fetch('/api/games', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const d = await r.json()
      if (r.ok) { setSaved(true); setTimeout(() => router.push('/admin/games'), 1000) }
      else alert(d.error || 'Save failed')
    } catch(e) { alert('Error: ' + e) }
    setSaving(false)
  }

  const inp: any = { width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff' }
  const lbl: any = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }
  const card: any = { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: '16px' }
  const g2: any = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }
  const g3: any = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }
  const TABS = [{id:'general',l:'General'},{id:'media',l:'Media'},{id:'download',l:'Downloads'},{id:'seo',l:'SEO'}]

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' as any, gap: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Add New Game</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#16a34a', fontWeight: 600 }}>\u2713 Saved!</span>}
          <button onClick={() => save('draft')} disabled={saving} style={{ background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Save Draft</button>
          <button onClick={() => save('published')} disabled={saving} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>{saving ? 'Publishing...' : 'Publish'}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {TABS.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', background: activeTab===t.id?'#4f46e5':'#fff', color: activeTab===t.id?'#fff':'#374151', boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}>{t.l}</button>)}
      </div>

      {activeTab === 'general' && (<>
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>Basic Info</h3>
          <div style={{ marginBottom: '14px' }}><label style={lbl}>Title *</label><input style={inp} value={form.title} onChange={e => { set('title', e.target.value); if (!form.slug) set('slug', genSlug(e.target.value)) }} placeholder='Game title...' /></div>
          <div style={g2}>
            <div><label style={lbl}>Slug</label><input style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder='auto-generated' /></div>
            <div><label style={lbl}>Category *</label><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div style={{ marginTop: '14px' }}><label style={lbl}>Tags (comma separated)</label><input style={inp} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder='action, fps, multiplayer...' /></div>
        </div>
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>Game Details</h3>
          <div style={g3}>
            <div><label style={lbl}>File Size *</label><input style={inp} value={form.size} onChange={e => set('size', e.target.value)} placeholder='2.5 GB' /></div>
            <div><label style={lbl}>Original Size</label><input style={inp} value={form.originalSize} onChange={e => set('originalSize', e.target.value)} placeholder='15 GB' /></div>
            <div><label style={lbl}>Version</label><input style={inp} value={form.version} onChange={e => set('version', e.target.value)} placeholder='v1.0' /></div>
            <div><label style={lbl}>Developer</label><input style={inp} value={form.developer} onChange={e => set('developer', e.target.value)} /></div>
            <div><label style={lbl}>Publisher</label><input style={inp} value={form.publisher} onChange={e => set('publisher', e.target.value)} /></div>
            <div><label style={lbl}>Release Year</label><input style={inp} value={form.releaseYear} onChange={e => set('releaseYear', e.target.value)} placeholder='2024' /></div>
          </div>
        </div>
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>Description</h3>
          <div style={{ marginBottom: '14px' }}><label style={lbl}>Short Excerpt</label><input style={inp} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder='Brief description for cards...' /></div>
          <div><label style={lbl}>Full Description</label><textarea style={{ ...inp, height: '180px', resize: 'vertical', fontFamily: 'inherit' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder='Detailed game description...' /></div>
        </div>
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>Publish Settings</h3>
          <div style={g2}>
            <div><label style={lbl}>Status</label><select style={inp} value={form.status} onChange={e => set('status', e.target.value)}><option value='draft'>Draft</option><option value='published'>Published</option><option value='scheduled'>Scheduled</option></select></div>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type='checkbox' checked={form.featured} onChange={e => set('featured', e.target.checked)} /><span style={{ fontSize: '14px', fontWeight: 500 }}>Featured Game</span></label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type='checkbox' checked={form.trending} onChange={e => set('trending', e.target.checked)} /><span style={{ fontSize: '14px', fontWeight: 500 }}>Trending</span></label>
          </div>
        </div>
      </>)}

      {activeTab === 'media' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>Media</h3>
          <div style={{ marginBottom: '16px' }}><label style={lbl}>Cover Image URL</label><input style={inp} value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder='https://...' />{form.coverImage && <img src={form.coverImage} alt='cover' style={{ marginTop: '10px', width: '200px', height: '130px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />}</div>
          <div><label style={lbl}>Image Alt Text</label><input style={inp} value={form.altText} onChange={e => set('altText', e.target.value)} /></div>
          <div style={{ marginTop: '16px' }}><label style={lbl}>Gallery Images (one URL per line)</label><textarea style={{ ...inp, height: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={form.gallery} onChange={e => set('gallery', e.target.value)} placeholder={'https://img1.jpg\nhttps://img2.jpg'} /></div>
        </div>
      )}

      {activeTab === 'download' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>Download Links</h3>
          <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '13px' }}>One URL per line. You can add multiple mirror links.</p>
          <textarea style={{ ...inp, height: '200px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }} value={form.downloadLinks} onChange={e => set('downloadLinks', e.target.value)} placeholder={'https://drive.google.com/file/...\nhttps://mega.nz/file/...'} />
        </div>
      )}

      {activeTab === 'seo' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>SEO Settings</h3>
          <div style={{ marginBottom: '14px' }}><label style={lbl}>SEO Title</label><input style={inp} value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)} placeholder={form.title || 'SEO title...'} /></div>
          <div style={{ marginBottom: '14px' }}><label style={lbl}>Meta Description</label><textarea style={{ ...inp, height: '80px', resize: 'none' }} value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)} placeholder='Meta description...' /></div>
          <div><label style={lbl}>Keywords</label><input style={inp} value={form.seoKeywords} onChange={e => set('seoKeywords', e.target.value)} placeholder='keyword1, keyword2...' /></div>
        </div>
      )}
    </div>
  )
}