'use client'
import { useState, useEffect } from 'react'

const DEFAULTS = {
  siteName: 'CompressedGamesPC',
  tagline: 'Free Highly Compressed PC Games',
  navbarHeight: '52',
  logoSize: 'normal',
  searchWidth: '360',
  searchPosition: 'left',
  showCatsBar: true,
  showSearchBar: true,
  showAnnouncement: true,
  showHotButton: true,
  announcementText: '🎮 All games are highly compressed — Save your bandwidth!',
  announcementBg: '#4f46e5',
  navBg: '#1a1f3c',
  accentColor: '#4f46e5',
  accentColor2: '#e53935',
  bodyBg: '#f0f2f8',
  footerBg: '#1a1f3c',
  footerText: '© 2026 CompressedGamesPC.com',
  footerAbout: 'Your #1 source for highly compressed PC games.',
  socialFacebook: '',
  socialTelegram: '',
  socialYoutube: '',
  socialDiscord: '',
  hotLabel: 'HOT',
  newLabel: 'NEW',
  showRating: true,
  showDownloadCount: true,
  showCompressedBadge: true,
  bannerEnabled: true,
  bannerHeight: '280',
  showUserReviews: true,
  downloadBtnPlacement: 'top',
  showAbout: true,
  showContact: true,
  showPrivacy: true,
  showDisclaimer: true,
  showDmca: true,
  showTerms: true,
  footerShowLinks: true,
  footerColumns: '4',
  seoTitle: '',
  seoDesc: '',
  seoKeywords: '',
}

export default function AppearancePage() {
  const [cfg, setCfg] = useState(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings?key=appearance', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d && typeof d === 'object') setCfg(prev => ({ ...prev, ...d })) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: any) => setCfg(prev => ({ ...prev, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'appearance', value: cfg })
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch(e) { alert('Save failed!') }
    setSaving(false)
  }

  const btn = { background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }
  const card = { background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }
  const label = { display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }
  const input = { width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' as any }
  const row = { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' as any }
  const toggle = (k: string) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <input type="checkbox" checked={!!(cfg as any)[k]} onChange={e => set(k, e.target.checked)} style={{ width: '16px', height: '16px' }} />
      <span style={{ fontSize: '13px', color: '#374151' }}>{k}</span>
    </label>
  )

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ padding: '24px', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Appearance & Customization</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '14px' }}>✓ Saved!</span>}
          <a href="/" target="_blank" style={{ ...btn, background: '#f3f4f6', color: '#374151', textDecoration: 'none', padding: '10px 16px' }}>Preview ↗</a>
          <button onClick={save} disabled={saving} style={{ ...btn, opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* Site Identity */}
      <div style={card}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>🌐 Site Identity</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div><label style={label}>Site Name</label><input style={input} value={cfg.siteName} onChange={e => set('siteName', e.target.value)} /></div>
          <div><label style={label}>Tagline</label><input style={input} value={cfg.tagline} onChange={e => set('tagline', e.target.value)} /></div>
        </div>
      </div>

      {/* Navbar */}
      <div style={card}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>🔝 Navbar</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={label}>Navbar Height</label>
            <select style={input} value={cfg.navbarHeight} onChange={e => set('navbarHeight', e.target.value)}>
              <option value="44">Small (44px)</option>
              <option value="52">Normal (52px)</option>
              <option value="64">Large (64px)</option>
              <option value="72">Extra Large (72px)</option>
            </select>
          </div>
          <div>
            <label style={label}>Search Width</label>
            <select style={input} value={cfg.searchWidth} onChange={e => set('searchWidth', e.target.value)}>
              <option value="200">Small (200px)</option>
              <option value="360">Normal (360px)</option>
              <option value="500">Large (500px)</option>
              <option value="100%">Full Width</option>
            </select>
          </div>
          <div>
            <label style={label}>Search Position</label>
            <select style={input} value={cfg.searchPosition} onChange={e => set('searchPosition', e.target.value)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        <div style={row}>
          {['showCatsBar','showSearchBar','showAnnouncement','showHotButton'].map(k => toggle(k))}
        </div>
      </div>

      {/* Colors */}
      <div style={card}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>🎨 Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[['navBg','Navbar BG'],['accentColor','Accent Color'],['accentColor2','Accent 2'],['announcementBg','Announcement BG'],['bodyBg','Body BG'],['footerBg','Footer BG']].map(([k,l]) => (
            <div key={k}>
              <label style={label}>{l}</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={(cfg as any)[k] || '#000000'} onChange={e => set(k, e.target.value)} style={{ width: '40px', height: '36px', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', padding: '2px' }} />
                <input style={{ ...input, flex: 1 }} value={(cfg as any)[k] || ''} onChange={e => set(k, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement */}
      <div style={card}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>📢 Announcement Bar</h3>
        <div><label style={label}>Announcement Text</label><input style={input} value={cfg.announcementText} onChange={e => set('announcementText', e.target.value)} /></div>
      </div>

      {/* Game Cards */}
      <div style={card}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>🎮 Game Cards</h3>
        <div style={row}>
          {['showRating','showDownloadCount','showCompressedBadge'].map(k => toggle(k))}
        </div>
        <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div><label style={label}>Hot Label</label><input style={input} value={cfg.hotLabel} onChange={e => set('hotLabel', e.target.value)} /></div>
          <div><label style={label}>New Label</label><input style={input} value={cfg.newLabel} onChange={e => set('newLabel', e.target.value)} /></div>
        </div>
      </div>

      {/* Footer */}
      <div style={card}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>🦶 Footer</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div><label style={label}>Footer Text</label><input style={input} value={cfg.footerText} onChange={e => set('footerText', e.target.value)} /></div>
          <div><label style={label}>Footer About</label><input style={input} value={cfg.footerAbout} onChange={e => set('footerAbout', e.target.value)} /></div>
          <div><label style={label}>Facebook URL</label><input style={input} value={cfg.socialFacebook} onChange={e => set('socialFacebook', e.target.value)} /></div>
          <div><label style={label}>Telegram URL</label><input style={input} value={cfg.socialTelegram} onChange={e => set('socialTelegram', e.target.value)} /></div>
          <div><label style={label}>YouTube URL</label><input style={input} value={cfg.socialYoutube} onChange={e => set('socialYoutube', e.target.value)} /></div>
          <div><label style={label}>Discord URL</label><input style={input} value={cfg.socialDiscord} onChange={e => set('socialDiscord', e.target.value)} /></div>
        </div>
        <div style={row}>
          {['showAbout','showContact','showPrivacy','showDisclaimer','showDmca','showTerms','footerShowLinks'].map(k => toggle(k))}
        </div>
      </div>

      <button onClick={save} disabled={saving} style={{ ...btn, width: '100%', padding: '14px', fontSize: '16px' }}>{saving ? 'Saving...' : '💾 Save All Changes'}</button>
    </div>
  )
}