'use client'
import { useState, useEffect } from 'react'

const DEFAULTS: Record<string,any> = {
  siteName: 'CompressedGamesPC', tagline: 'Free Highly Compressed PC Games',
  navBg: '#1a1f3c', navbarHeight: '52', logoSize: 'normal',
  searchWidth: '360', searchPosition: 'left',
  showCatsBar: true, showSearchBar: true, showAnnouncement: true, showHotButton: true,
  announcementText: '\ud83c\udfae All games are highly compressed \u2014 Save your bandwidth!',
  announcementBg: '#4f46e5', accentColor: '#4f46e5', accentColor2: '#e53935',
  bodyBg: '#f0f2f8', footerBg: '#1a1f3c',
  footerText: '\u00a9 2026 CompressedGamesPC.com',
  footerAbout: 'Your #1 source for highly compressed PC games.',
  socialFacebook: '', socialTelegram: '', socialYoutube: '', socialDiscord: '',
  hotLabel: 'HOT', newLabel: 'NEW',
  showRating: true, showDownloadCount: true, showCompressedBadge: true,
  bannerEnabled: true, bannerHeight: '280', showUserReviews: true,
  downloadBtnPlacement: 'top',
  showAbout: true, showContact: true, showPrivacy: true,
  showDisclaimer: true, showDmca: true, showTerms: true,
  footerShowLinks: true, footerColumns: '4',
}

export default function AppearancePage() {
  const [cfg, setCfg] = useState<Record<string,any>>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('navbar')

  useEffect(() => {
    fetch('/api/settings?key=appearance', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => { if (d && typeof d === 'object') setCfg(p => ({ ...p, ...d })) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: any) => setCfg(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      const r = await fetch('/api/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'appearance', value: cfg })
      })
      if (!r.ok) throw new Error('failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { alert('Save failed!') }
    setSaving(false)
  }

  const inp: any = { width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }
  const card: any = { background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }
  const lbl: any = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }
  const g2: any = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }
  const g3: any = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }

  const Toggle = ({ k, label }: { k: string, label: string }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 14px', border: '1px solid', borderColor: cfg[k] ? '#4f46e5' : '#e5e7eb', borderRadius: '8px', background: cfg[k] ? '#f5f3ff' : '#fff', userSelect: 'none' as any }}>
      <input type='checkbox' checked={!!cfg[k]} onChange={(e: any) => set(k, e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#4f46e5' } as any} />
      <span style={{ fontSize: '13px', fontWeight: 500, color: cfg[k] ? '#4f46e5' : '#6b7280' }}>{label}</span>
    </label>
  )

  const ColorRow = ({ k, label }: { k: string, label: string }) => (
    <div>
      <label style={lbl}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type='color' value={cfg[k] || '#000000'} onChange={(e: any) => set(k, e.target.value)} style={{ width: '44px', height: '38px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', padding: '2px', flexShrink: 0 }} />
        <input style={inp} value={cfg[k] || ''} onChange={(e: any) => set(k, e.target.value)} placeholder='#000000' />
      </div>
    </div>
  )

  const TABS = ['navbar','colors','identity','homepage','gamecards','footer','social']
  const TLABELS: Record<string,string> = { navbar: '\ud83d\udd1d Navbar', colors: '\ud83c\udfa8 Colors', identity: '\ud83c\udf10 Identity', homepage: '\ud83c\udfe0 Homepage', gamecards: '\ud83c\udfae Game Cards', footer: '\ud83e\uddb6 Footer', social: '\ud83d\udcf1 Social' }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading settings from database...</div>

  return (
    <div style={{ padding: '24px', maxWidth: '960px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' as any, gap: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>\ud83c\udfa8 Appearance & Customization</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#16a34a', fontWeight: 700 }}>\u2713 Saved to DB!</span>}
          <a href='/' target='_blank' style={{ background: '#f3f4f6', color: '#374151', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Preview \u2197</a>
          <button onClick={save} disabled={saving} style={{ background: saving ? '#818cf8' : '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>{saving ? 'Saving...' : '\ud83d\udcbe Save Changes'}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' as any }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', background: tab===t ? '#4f46e5' : '#f3f4f6', color: tab===t ? '#fff' : '#374151' }}>{TLABELS[t]}</button>
        ))}
      </div>

      {tab === 'navbar' && (
        <>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Navbar Size & Layout</h3>
            <div style={g3}>
              <div><label style={lbl}>Navbar Height</label>
                <select style={inp} value={cfg.navbarHeight} onChange={(e: any) => set('navbarHeight', e.target.value)}>
                  <option value='44'>Small (44px)</option><option value='52'>Normal (52px)</option><option value='64'>Large (64px)</option><option value='72'>Extra Large (72px)</option>
                </select></div>
              <div><label style={lbl}>Logo Size</label>
                <select style={inp} value={cfg.logoSize} onChange={(e: any) => set('logoSize', e.target.value)}>
                  <option value='small'>Small</option><option value='normal'>Normal</option><option value='large'>Large</option>
                </select></div>
              <div><label style={lbl}>Search Bar Width</label>
                <select style={inp} value={cfg.searchWidth} onChange={(e: any) => set('searchWidth', e.target.value)}>
                  <option value='200'>Small (200px)</option><option value='360'>Normal (360px)</option><option value='500'>Large (500px)</option><option value='100%'>Full Width</option>
                </select></div>
            </div>
            <div style={{ marginTop: '14px' }}>
              <label style={lbl}>Search Bar Position</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {(['left','center','right'] as string[]).map(p => (
                  <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type='radio' name='searchPos' value={p} checked={cfg.searchPosition===p} onChange={() => set('searchPosition', p)} />
                    <span style={{ textTransform: 'capitalize' as any, fontSize: '14px' }}>{p}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Show / Hide Navbar Items</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as any }}>
              <Toggle k='showCatsBar' label='Categories Bar' />
              <Toggle k='showSearchBar' label='Search Bar' />
              <Toggle k='showAnnouncement' label='Announcement Bar' />
              <Toggle k='showHotButton' label='\ud83d\udd25 Hot Button' />
            </div>
          </div>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Announcement Bar</h3>
            <div style={g2}>
              <div><label style={lbl}>Announcement Text</label><input style={inp} value={cfg.announcementText} onChange={(e: any) => set('announcementText', e.target.value)} /></div>
              <div><label style={lbl}>Hot Button Label</label><input style={inp} value={cfg.hotLabel} onChange={(e: any) => set('hotLabel', e.target.value)} /></div>
            </div>
          </div>
        </>
      )}

      {tab === 'colors' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Site Colors</h3>
          <div style={g3}>
            <ColorRow k='navBg' label='Navbar Background' />
            <ColorRow k='accentColor' label='Primary Accent' />
            <ColorRow k='accentColor2' label='Secondary Accent' />
            <ColorRow k='announcementBg' label='Announcement BG' />
            <ColorRow k='bodyBg' label='Page Background' />
            <ColorRow k='footerBg' label='Footer Background' />
          </div>
        </div>
      )}

      {tab === 'identity' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Site Identity</h3>
          <div style={g2}>
            <div><label style={lbl}>Site Name</label><input style={inp} value={cfg.siteName} onChange={(e: any) => set('siteName', e.target.value)} /></div>
            <div><label style={lbl}>Tagline</label><input style={inp} value={cfg.tagline} onChange={(e: any) => set('tagline', e.target.value)} /></div>
          </div>
        </div>
      )}

      {tab === 'homepage' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Homepage Settings</h3>
          <div style={g2}>
            <div><label style={lbl}>Banner Height (px)</label><input style={inp} value={cfg.bannerHeight} onChange={(e: any) => set('bannerHeight', e.target.value)} /></div>
            <div><label style={lbl}>Download Button Placement</label>
              <select style={inp} value={cfg.downloadBtnPlacement} onChange={(e: any) => set('downloadBtnPlacement', e.target.value)}>
                <option value='top'>Top</option><option value='bottom'>Bottom</option><option value='both'>Both</option>
              </select></div>
          </div>
          <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' as any }}>
            <Toggle k='bannerEnabled' label='Hero Banner' />
            <Toggle k='showUserReviews' label='User Reviews' />
          </div>
        </div>
      )}

      {tab === 'gamecards' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Game Card Options</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as any, marginBottom: '16px' }}>
            <Toggle k='showRating' label='\u2b50 Rating' />
            <Toggle k='showDownloadCount' label='\ud83d\udce5 Download Count' />
            <Toggle k='showCompressedBadge' label='\ud83d\udddc Compressed Badge' />
          </div>
          <div style={g2}>
            <div><label style={lbl}>Hot Label Text</label><input style={inp} value={cfg.hotLabel} onChange={(e: any) => set('hotLabel', e.target.value)} /></div>
            <div><label style={lbl}>New Label Text</label><input style={inp} value={cfg.newLabel} onChange={(e: any) => set('newLabel', e.target.value)} /></div>
          </div>
        </div>
      )}

      {tab === 'footer' && (
        <>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Footer Content</h3>
            <div style={g2}>
              <div><label style={lbl}>Copyright Text</label><input style={inp} value={cfg.footerText} onChange={(e: any) => set('footerText', e.target.value)} /></div>
              <div><label style={lbl}>About Text</label><input style={inp} value={cfg.footerAbout} onChange={(e: any) => set('footerAbout', e.target.value)} /></div>
            </div>
          </div>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Footer Pages</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as any }}>
              <Toggle k='showAbout' label='About' />
              <Toggle k='showContact' label='Contact' />
              <Toggle k='showPrivacy' label='Privacy Policy' />
              <Toggle k='showDisclaimer' label='Disclaimer' />
              <Toggle k='showDmca' label='DMCA' />
              <Toggle k='showTerms' label='Terms' />
              <Toggle k='footerShowLinks' label='Footer Links' />
            </div>
          </div>
        </>
      )}

      {tab === 'social' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Social Media Links</h3>
          <div style={g2}>
            <div><label style={lbl}>Facebook URL</label><input style={inp} value={cfg.socialFacebook} onChange={(e: any) => set('socialFacebook', e.target.value)} placeholder='https://facebook.com/...' /></div>
            <div><label style={lbl}>Telegram URL</label><input style={inp} value={cfg.socialTelegram} onChange={(e: any) => set('socialTelegram', e.target.value)} placeholder='https://t.me/...' /></div>
            <div><label style={lbl}>YouTube URL</label><input style={inp} value={cfg.socialYoutube} onChange={(e: any) => set('socialYoutube', e.target.value)} placeholder='https://youtube.com/...' /></div>
            <div><label style={lbl}>Discord URL</label><input style={inp} value={cfg.socialDiscord} onChange={(e: any) => set('socialDiscord', e.target.value)} placeholder='https://discord.gg/...' /></div>
          </div>
        </div>
      )}

      <button onClick={save} disabled={saving} style={{ background: saving ? '#818cf8' : '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 700, cursor: 'pointer', width: '100%', fontSize: '16px', marginTop: '8px' }}>
        {saving ? 'Saving...' : '\ud83d\udcbe Save All Changes'}
      </button>
    </div>
  )
}