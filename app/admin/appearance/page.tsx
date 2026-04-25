'use client'
import { useState, useEffect } from 'react'

const AD: Record<string,any> = {
  siteName: 'CompressedGamesPC', tagline: 'Free Highly Compressed PC Games',
  navBg: '#1a1f3c', navbarHeight: '52', logoSize: 'normal', searchWidth: '360', searchPosition: 'left',
  showCatsBar: true, showSearchBar: true, showAnnouncement: true, showHotButton: true,
  announcementText: '\u{1F3AE} All games are highly compressed \u2014 Save your bandwidth!',
  announcementBg: '#4f46e5', accentColor: '#4f46e5', accentColor2: '#e53935',
  bodyBg: '#f0f2f8', footerBg: '#1a1f3c',
  footerText: '\u00a9 2026 CompressedGamesPC.com',
  footerAbout: 'Your #1 source for highly compressed PC games.',
  socialFacebook: '', socialTelegram: '', socialYoutube: '', socialDiscord: '',
  hotLabel: 'HOT', newLabel: 'NEW',
  showRating: true, showDownloadCount: true, showCompressedBadge: true,
  bannerEnabled: true, bannerHeight: '280', showUserReviews: true, downloadBtnPlacement: 'top',
  showAbout: true, showContact: true, showPrivacy: true, showDisclaimer: true, showDmca: true, showTerms: true,
  footerShowBrand: true, footerShowCats1: true, footerShowCats2: true,
  footerShowLinks: true, footerShowCopyright: true, footerShowSocial: true,
}

export default function AppearancePage() {
  const [cfg, setCfg] = useState<Record<string,any>>(AD)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('navbar')

  useEffect(() => {
    fetch('/api/settings?key=appearance&t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then((d: any) => { if (d && typeof d === 'object') setCfg(p => ({ ...p, ...d })) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (k: string, v: any) => setCfg(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      const r = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'appearance', value: cfg }) })
      if (!r.ok) throw new Error('failed')
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch { alert('Save failed!') }
    setSaving(false)
  }

  const si: any = { width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }
  const sc: any = { background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }
  const sl: any = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }
  const g2: any = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }
  const g3: any = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }

  const Tog = ({ k, label }: { k: string; label: string }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 14px', border: '2px solid', borderColor: cfg[k] ? '#4f46e5' : '#e5e7eb', borderRadius: '8px', background: cfg[k] ? '#f5f3ff' : '#fff', userSelect: 'none' as any }}>
      <input type='checkbox' checked={!!cfg[k]} onChange={(e: any) => set(k, e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#4f46e5' } as any} />
      <span style={{ fontSize: '13px', fontWeight: 500, color: cfg[k] ? '#4f46e5' : '#6b7280' }}>{label}</span>
    </label>
  )
  const Col = ({ k, label }: { k: string; label: string }) => (
    <div>
      <label style={sl}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type='color' value={cfg[k] || '#000000'} onChange={(e: any) => set(k, e.target.value)} style={{ width: '44px', height: '38px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', padding: '2px' }} />
        <input style={si} value={cfg[k] || ''} onChange={(e: any) => set(k, e.target.value)} placeholder='#000000' />
      </div>
    </div>
  )

  const TABS = [{id:'navbar',l:'\ud83d\udd1d Navbar'},{id:'colors',l:'\ud83c\udfa8 Colors'},{id:'identity',l:'\ud83c\udf10 Identity'},{id:'homepage',l:'\ud83c\udfe0 Homepage'},{id:'gamecards',l:'\ud83c\udfae Games'},{id:'footer',l:'\ud83e\uddb4 Footer'},{id:'social',l:'\ud83d\udcf1 Social'}]

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>Loading settings...</div>

  return (
    <div style={{ padding: '24px', maxWidth: '960px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' as any, gap: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>\ud83c\udfa8 Appearance & Customization</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ color: '#16a34a', fontWeight: 700 }}>\u2713 Saved to DB!</span>}
          <a href='/' target='_blank' style={{ background: '#f3f4f6', color: '#374151', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Preview \u2197</a>
          <button onClick={save} disabled={saving} style={{ background: saving?'#818cf8':'#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
            {saving ? 'Saving...' : '\ud83d\udcbe Save Changes'}
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' as any }}>
        {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', background: tab===t.id?'#4f46e5':'#f3f4f6', color: tab===t.id?'#fff':'#374151' }}>{t.l}</button>)}
      </div>

      {tab==='navbar' && (<>
        <div style={sc}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Navbar Size</h3>
          <div style={g3}>
            <div><label style={sl}>Height</label><select style={si} value={cfg.navbarHeight} onChange={(e:any)=>set('navbarHeight',e.target.value)}><option value='44'>Small (44px)</option><option value='52'>Normal (52px)</option><option value='64'>Large (64px)</option><option value='72'>XL (72px)</option></select></div>
            <div><label style={sl}>Logo Size</label><select style={si} value={cfg.logoSize} onChange={(e:any)=>set('logoSize',e.target.value)}><option value='small'>Small</option><option value='normal'>Normal</option><option value='large'>Large</option></select></div>
            <div><label style={sl}>Search Width</label><select style={si} value={cfg.searchWidth} onChange={(e:any)=>set('searchWidth',e.target.value)}><option value='200'>Small (200px)</option><option value='360'>Normal (360px)</option><option value='500'>Large (500px)</option><option value='100%'>Full Width</option></select></div>
          </div>
          <div style={{ marginTop: '14px' }}><label style={sl}>Search Position</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {(['left','center','right'] as string[]).map(p => <label key={p} style={{ display:'flex',alignItems:'center',gap:'6px',cursor:'pointer' }}><input type='radio' name='sp' value={p} checked={cfg.searchPosition===p} onChange={()=>set('searchPosition',p)} /><span style={{ textTransform:'capitalize' as any, fontSize:'14px' }}>{p}</span></label>)}
            </div>
          </div>
        </div>
        <div style={sc}><h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Show / Hide</h3>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' as any }}>
            <Tog k='showCatsBar' label='Categories Bar' /><Tog k='showSearchBar' label='Search Bar' /><Tog k='showAnnouncement' label='Announcement Bar' /><Tog k='showHotButton' label='\ud83d\udd25 Hot Button' />
          </div>
        </div>
        <div style={sc}><h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Announcement Bar</h3>
          <div style={g2}>
            <div><label style={sl}>Text</label><input style={si} value={cfg.announcementText} onChange={(e:any)=>set('announcementText',e.target.value)} /></div>
            <div><label style={sl}>Hot Button Label</label><input style={si} value={cfg.hotLabel} onChange={(e:any)=>set('hotLabel',e.target.value)} /></div>
          </div>
        </div>
      </>)}

      {tab==='colors' && (<div style={sc}><h3 style={{ margin:'0 0 20px', fontSize:'16px', fontWeight:700 }}>Site Colors</h3>
        <div style={g3}><Col k='navBg' label='Navbar BG' /><Col k='accentColor' label='Primary Accent' /><Col k='accentColor2' label='Secondary Accent' /><Col k='announcementBg' label='Announcement BG' /><Col k='bodyBg' label='Page BG' /><Col k='footerBg' label='Footer BG' /></div>
      </div>)}

      {tab==='identity' && (<div style={sc}><h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Site Identity</h3>
        <div style={g2}><div><label style={sl}>Site Name</label><input style={si} value={cfg.siteName} onChange={(e:any)=>set('siteName',e.target.value)} /></div><div><label style={sl}>Tagline</label><input style={si} value={cfg.tagline} onChange={(e:any)=>set('tagline',e.target.value)} /></div></div>
      </div>)}

      {tab==='homepage' && (<div style={sc}><h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Homepage</h3>
        <div style={g2}><div><label style={sl}>Banner Height (px)</label><input style={si} value={cfg.bannerHeight} onChange={(e:any)=>set('bannerHeight',e.target.value)} /></div>
        <div><label style={sl}>Download Btn</label><select style={si} value={cfg.downloadBtnPlacement} onChange={(e:any)=>set('downloadBtnPlacement',e.target.value)}><option value='top'>Top</option><option value='bottom'>Bottom</option><option value='both'>Both</option></select></div></div>
        <div style={{ marginTop:'14px', display:'flex', gap:'10px', flexWrap:'wrap' as any }}><Tog k='bannerEnabled' label='Hero Banner' /><Tog k='showUserReviews' label='User Reviews' /></div>
      </div>)}

      {tab==='gamecards' && (<div style={sc}><h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Game Cards</h3>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' as any, marginBottom:'16px' }}><Tog k='showRating' label='\u2b50 Rating' /><Tog k='showDownloadCount' label='\ud83d\udce5 Downloads' /><Tog k='showCompressedBadge' label='\ud83d\udddc Badge' /></div>
        <div style={g2}><div><label style={sl}>Hot Label</label><input style={si} value={cfg.hotLabel} onChange={(e:any)=>set('hotLabel',e.target.value)} /></div><div><label style={sl}>New Label</label><input style={si} value={cfg.newLabel} onChange={(e:any)=>set('newLabel',e.target.value)} /></div></div>
      </div>)}

      {tab==='footer' && (<>
        <div style={sc}><h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Footer Content</h3>
          <div style={g2}>
            <div><label style={sl}>Copyright Text</label><input style={si} value={cfg.footerText} onChange={(e:any)=>set('footerText',e.target.value)} /></div>
            <div><label style={sl}>About / Description</label><input style={si} value={cfg.footerAbout} onChange={(e:any)=>set('footerAbout',e.target.value)} /></div>
          </div>
        </div>
        <div style={sc}><h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Footer Colors</h3>
          <div style={g2}><Col k='footerBg' label='Footer Background' /><Col k='accentColor' label='Accent Color' /></div>
        </div>
        <div style={sc}><h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Footer Columns (Show/Hide)</h3>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' as any }}>
            <Tog k='footerShowBrand' label='Brand Column' /><Tog k='footerShowCats1' label='Games Column' />
            <Tog k='footerShowCats2' label='More Games' /><Tog k='footerShowLinks' label='Quick Links' />
          </div>
        </div>
        <div style={sc}><h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Footer Elements</h3>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' as any }}>
            <Tog k='footerShowCopyright' label='Copyright Bar' /><Tog k='footerShowSocial' label='Social Links' />
          </div>
        </div>
        <div style={sc}><h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Footer Pages (Show/Hide)</h3>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' as any }}>
            <Tog k='showAbout' label='About Us' /><Tog k='showContact' label='Contact' /><Tog k='showPrivacy' label='Privacy Policy' />
            <Tog k='showDisclaimer' label='Disclaimer' /><Tog k='showDmca' label='DMCA' /><Tog k='showTerms' label='Terms' />
          </div>
        </div>
      </>)}

      {tab==='social' && (<div style={sc}><h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:700 }}>Social Media</h3>
        <div style={g2}>
          <div><label style={sl}>Facebook URL</label><input style={si} value={cfg.socialFacebook} onChange={(e:any)=>set('socialFacebook',e.target.value)} placeholder='https://facebook.com/...' /></div>
          <div><label style={sl}>Telegram URL</label><input style={si} value={cfg.socialTelegram} onChange={(e:any)=>set('socialTelegram',e.target.value)} placeholder='https://t.me/...' /></div>
          <div><label style={sl}>YouTube URL</label><input style={si} value={cfg.socialYoutube} onChange={(e:any)=>set('socialYoutube',e.target.value)} placeholder='https://youtube.com/...' /></div>
          <div><label style={sl}>Discord URL</label><input style={si} value={cfg.socialDiscord} onChange={(e:any)=>set('socialDiscord',e.target.value)} placeholder='https://discord.gg/...' /></div>
        </div>
      </div>)}

      <button onClick={save} disabled={saving} style={{ background: saving?'#818cf8':'#4f46e5', color:'#fff', border:'none', borderRadius:'12px', padding:'14px', fontWeight:700, cursor:'pointer', width:'100%', fontSize:'16px', marginTop:'8px' }}>
        {saving ? 'Saving...' : '\ud83d\udcbe Save All Changes'}
      </button>
    </div>
  )
}