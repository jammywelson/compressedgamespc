'use client'
import { useState, useEffect } from 'react'

const SI: React.CSSProperties = { width:'100%', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'9px 12px', color:'#111827', fontSize:'13px', outline:'none', fontFamily:'inherit' }
const LB: React.CSSProperties = { fontSize:'12px', color:'#374151', fontWeight:500, marginBottom:'5px', display:'block' }

interface AdSlot { id:string; name:string; position:string; code:string; enabled:boolean; size:string }

const DEFAULT_ADS: AdSlot[] = [
  { id:'1', name:'Header Banner',      position:'Navbar ke neeche',          code:'', enabled:false, size:'728x90'  },
  { id:'2', name:'Below Game Title',   position:'Game page — title ke neeche',code:'', enabled:false, size:'728x90'  },
  { id:'3', name:'Sidebar Ad',         position:'Game page — right sidebar',  code:'', enabled:false, size:'300x250' },
  { id:'4', name:'Between Games',      position:'Homepage — sections ke beech',code:'', enabled:false, size:'728x90'  },
  { id:'5', name:'Footer Ad',          position:'Footer ke upar',             code:'', enabled:false, size:'728x90'  },
  { id:'6', name:'Mobile Banner',      position:'Mobile — neeche fixed',      code:'', enabled:false, size:'320x50'  },
  { id:'7', name:'Before Download',    position:'Download button se pehle',   code:'', enabled:false, size:'728x90'  },
  { id:'8', name:'After Description',  position:'Game description ke baad',   code:'', enabled:false, size:'728x90'  },
]

export default function AdsPage() {
  const [ads, setAds]     = useState<AdSlot[]>(DEFAULT_ADS)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings?key=ads')
      .then(r=>r.json())
      .then(d=>{ if(d&&Array.isArray(d)) setAds(d) })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  }, [])

  const updAd = (id:string, k:string, v:any) => setAds(a=>a.map(x=>x.id===id?{...x,[k]:v}:x))

  const saveAds = async () => {
    await fetch('/api/settings', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ key:'ads', value:ads })
    })
    setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  const Toggle = ({val,onChange}:{val:boolean;onChange:(v:boolean)=>void}) => (
    <div style={{width:'44px',height:'24px',borderRadius:'12px',background:val?'#4f46e5':'#d1d5db',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0}} onClick={()=>onChange(!val)}>
      <div style={{position:'absolute',top:'4px',left:val?'23px':'4px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .2s'}}/>
    </div>
  )

  return (
    <div style={{background:'#f0f2f8',minHeight:'100vh'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:'54px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>Ad Inserter</span>
        <button onClick={saveAds} style={{marginLeft:'auto',background:saved?'#16a34a':'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'8px 20px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
          {saved?'✓ Saved!':'Save All Ads'}
        </button>
      </div>
      <div style={{padding:'24px'}}>
        <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'8px',padding:'12px 16px',marginBottom:'20px',fontSize:'13px',color:'#92400e'}}>
          💡 Google AdSense, Media.net, ya koi bhi ad network ka code paste karo. Enable/disable individually.
        </div>
        {loading ? (
          <div style={{textAlign:'center' as any,padding:'40px',color:'#6b7280'}}>Loading...</div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
            {ads.map(ad=>(
              <div key={ad.id} style={{background:'#fff',border:`1px solid ${ad.enabled?'#c7d2fe':'#e5e7eb'}`,borderRadius:'10px',padding:'16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:600,color:'#111827'}}>{ad.name}</div>
                    <div style={{fontSize:'11px',color:'#6b7280',marginTop:'2px'}}>{ad.position}</div>
                    <div style={{fontSize:'10px',color:'#9ca3af',marginTop:'1px'}}>Size: {ad.size}</div>
                  </div>
                  <Toggle val={ad.enabled} onChange={v=>updAd(ad.id,'enabled',v)}/>
                </div>
                <div>
                  <label style={LB}>Ad Code</label>
                  <textarea
                    style={{...SI,minHeight:'80px',resize:'vertical' as any,fontFamily:'monospace',fontSize:'11px',opacity:ad.enabled?1:.6}}
                    value={ad.code}
                    onChange={e=>updAd(ad.id,'code',e.target.value)}
                    placeholder={`<!-- ${ad.name} ad code here -->`}
                    disabled={!ad.enabled}
                  />
                </div>
                {ad.enabled&&ad.code&&(
                  <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'5px',padding:'6px 10px',marginTop:'8px',fontSize:'11px',color:'#16a34a'}}>
                    ✓ Active — {ad.size}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
