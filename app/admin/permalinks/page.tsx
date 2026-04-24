'use client'
import { useState } from 'react'

export default function PermalinksPage() {
  const [saved, setSaved] = useState(false)
  const [structure, setStructure] = useState('game-only')
  const [customPrefix, setCustomPrefix] = useState('games')
  const [categoryPrefix, setCategoryPrefix] = useState('category')
  const [tagPrefix, setTagPrefix] = useState('tag')

  const STRUCTURES = [
    {
      id: 'game-only',
      label: 'Game Only',
      example: '/games/gta-san-andreas',
      desc: 'Clean URL — just the game slug. Best for SEO.',
      recommended: true,
    },
    {
      id: 'category-game',
      label: 'Category + Game',
      example: '/games/action/gta-san-andreas',
      desc: 'Category folder before game name. WordPress style.',
      recommended: false,
    },
    {
      id: 'prefix-game',
      label: 'Custom Prefix + Game',
      example: `/${customPrefix}/gta-san-andreas`,
      desc: 'Your own custom prefix before game slug.',
      recommended: false,
    },
    {
      id: 'download-game',
      label: 'Download + Game',
      example: '/download/gta-san-andreas',
      desc: 'Good for download sites — makes intent clear.',
      recommended: false,
    },
    {
      id: 'pc-games-game',
      label: 'PC-Games + Game (wifi4games style)',
      example: '/pc-games/gta-san-andreas',
      desc: 'Similar to wifi4games but without .html extension.',
      recommended: false,
    },
  ]

  const getPreview = () => {
    const slug = 'gta-san-andreas'
    const cat = 'action'
    switch(structure) {
      case 'game-only':      return `/games/${slug}`
      case 'category-game':  return `/games/${cat}/${slug}`
      case 'prefix-game':    return `/${customPrefix}/${slug}`
      case 'download-game':  return `/download/${slug}`
      case 'pc-games-game':  return `/pc-games/${slug}`
      default:               return `/games/${slug}`
    }
  }

  const inp: React.CSSProperties = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'8px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }

  return (
    <div>
      {/* Topbar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'0 24px', height:'54px', display:'flex', alignItems:'center' }}>
        <span style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'18px', fontWeight:700, color:'#111827' }}>Permalink Settings</span>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
          style={{ marginLeft:'auto', background:saved?'#16a34a':'#4f46e5', color:'#fff', border:'none', borderRadius:'7px', padding:'8px 20px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={{ padding:'24px', maxWidth:'780px' }}>

        {/* Info */}
        <div style={{ background:'#eef2ff', border:'1px solid #c7d2fe', borderRadius:'8px', padding:'14px 16px', marginBottom:'20px', fontSize:'13px', color:'#3730a3', lineHeight:1.7 }}>
          <strong>Permalink</strong> = game page ka URL structure.<br/>
          Ek baar set karne ke baad change mat karna — SEO rankings affect hoti hain. Google ne purana URL index kar lia hoga.
        </div>

        {/* Structure options */}
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 3px rgba(0,0,0,.05)' }}>
          <div style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'4px' }}>Game Page URL Structure</div>
          <div style={{ fontSize:'12px', color:'#6b7280', marginBottom:'18px' }}>Apna URL format choose karo</div>

          <div style={{ display:'flex', flexDirection:'column' as any, gap:'10px' }}>
            {STRUCTURES.map(s => (
              <label key={s.id} onClick={() => setStructure(s.id)}
                style={{ background: structure===s.id ? '#f0f4ff' : '#f9fafb', border:`2px solid ${structure===s.id?'#4f46e5':'#e5e7eb'}`, borderRadius:'8px', padding:'14px 16px', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:'12px', transition:'all .15s' }}>
                <div style={{ marginTop:'2px', width:'18px', height:'18px', borderRadius:'50%', border:`2px solid ${structure===s.id?'#4f46e5':'#d1d5db'}`, background:structure===s.id?'#4f46e5':'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {structure===s.id && <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#fff' }}/>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                    <span style={{ fontSize:'14px', fontWeight:600, color:'#111827' }}>{s.label}</span>
                    {s.recommended && <span style={{ background:'#dcfce7', color:'#16a34a', fontSize:'10px', fontWeight:700, padding:'1px 7px', borderRadius:'10px' }}>RECOMMENDED</span>}
                  </div>
                  <code style={{ background:'rgba(79,70,229,.08)', color:'#4f46e5', fontSize:'13px', padding:'3px 8px', borderRadius:'4px', fontFamily:'monospace', display:'inline-block', marginBottom:'4px' }}>
                    compressedgamespc.com{s.id==='prefix-game' ? `/${customPrefix}/gta-san-andreas` : s.example}
                  </code>
                  <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'3px' }}>{s.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {/* Custom prefix input */}
          {structure === 'prefix-game' && (
            <div style={{ marginTop:'14px', padding:'14px', background:'#f9fafb', borderRadius:'8px', border:'1px solid #e5e7eb' }}>
              <label style={{ fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }}>Custom Prefix</label>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ fontSize:'13px', color:'#6b7280' }}>compressedgamespc.com /</span>
                <input style={{ ...inp, width:'160px' }} value={customPrefix}
                  onChange={e => setCustomPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))}
                  placeholder="games"/>
                <span style={{ fontSize:'13px', color:'#6b7280' }}>/ gta-san-andreas</span>
              </div>
            </div>
          )}
        </div>

        {/* Live preview */}
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 3px rgba(0,0,0,.05)' }}>
          <div style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'14px' }}>Live Preview</div>
          <div style={{ display:'flex', flexDirection:'column' as any, gap:'10px' }}>
            {[
              { label:'GTA San Andreas', slug:'gta-san-andreas', cat:'open-world' },
              { label:'FIFA 23',         slug:'fifa-23',         cat:'sports' },
              { label:'Black Myth: Wukong', slug:'black-myth-wukong', cat:'action-rpg' },
            ].map(g => (
              <div key={g.slug} style={{ display:'flex', alignItems:'center', gap:'10px', background:'#f9fafb', borderRadius:'6px', padding:'9px 12px' }}>
                <span style={{ fontSize:'12px', color:'#6b7280', minWidth:'140px' }}>{g.label}</span>
                <span style={{ fontSize:'13px', color:'#6b7280' }}>→</span>
                <code style={{ background:'rgba(79,70,229,.08)', color:'#4f46e5', fontSize:'12px', padding:'3px 8px', borderRadius:'4px', fontFamily:'monospace' }}>
                  compressedgamespc.com{
                    structure==='game-only'     ? `/games/${g.slug}` :
                    structure==='category-game' ? `/games/${g.cat}/${g.slug}` :
                    structure==='prefix-game'   ? `/${customPrefix}/${g.slug}` :
                    structure==='download-game' ? `/download/${g.slug}` :
                    `/pc-games/${g.slug}`
                  }
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Category & Tag base */}
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'20px', marginBottom:'16px', boxShadow:'0 1px 3px rgba(0,0,0,.05)' }}>
          <div style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'4px' }}>Category & Tag Base</div>
          <div style={{ fontSize:'12px', color:'#6b7280', marginBottom:'16px' }}>WordPress jaisi category aur tag URL prefix</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <div>
              <label style={{ fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }}>Category Base</label>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ fontSize:'12px', color:'#6b7280', whiteSpace:'nowrap' as any }}>...com /</span>
                <input style={{ ...inp, flex:1 }} value={categoryPrefix}
                  onChange={e => setCategoryPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))}
                  placeholder="category"/>
                <span style={{ fontSize:'12px', color:'#6b7280', whiteSpace:'nowrap' as any }}>/ action</span>
              </div>
              <div style={{ marginTop:'6px', background:'#f9fafb', borderRadius:'5px', padding:'6px 10px' }}>
                <code style={{ fontSize:'11px', color:'#4f46e5', fontFamily:'monospace' }}>
                  ...com/{categoryPrefix}/action
                </code>
              </div>
            </div>
            <div>
              <label style={{ fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }}>Tag Base</label>
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ fontSize:'12px', color:'#6b7280', whiteSpace:'nowrap' as any }}>...com /</span>
                <input style={{ ...inp, flex:1 }} value={tagPrefix}
                  onChange={e => setTagPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))}
                  placeholder="tag"/>
                <span style={{ fontSize:'12px', color:'#6b7280', whiteSpace:'nowrap' as any }}>/ rpg</span>
              </div>
              <div style={{ marginTop:'6px', background:'#f9fafb', borderRadius:'5px', padding:'6px 10px' }}>
                <code style={{ fontSize:'11px', color:'#4f46e5', fontFamily:'monospace' }}>
                  ...com/{tagPrefix}/rpg
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* SEO tip */}
        <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'8px', padding:'14px 16px', fontSize:'13px', color:'#92400e', lineHeight:1.7 }}>
          <strong>⚠ Important:</strong> Permalink change karne ke baad:<br/>
          1. Cache clear karo (Admin → Site Stats → Cache Management)<br/>
          2. Google Search Console mein sitemap resubmit karo<br/>
          3. Purane URLs se 301 redirect lagao (agar pehle koi aur structure tha)
        </div>

      </div>
    </div>
  )
}
