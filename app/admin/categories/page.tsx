'use client'
import { useState, useEffect } from 'react'

const CATS = [
  { name:'Action',     slug:'action',     icon:'⚔️'  },
  { name:'Fighting',   slug:'fighting',   icon:'🥊'  },
  { name:'Strategy',   slug:'strategy',   icon:'♟️'  },
  { name:'Horror',     slug:'horror',     icon:'👻'  },
  { name:'Adventure',  slug:'adventure',  icon:'🗺️'  },
  { name:'Racing',     slug:'racing',     icon:'🏎️'  },
  { name:'Simulation', slug:'simulation', icon:'🏙️'  },
  { name:'Sports',     slug:'sports',     icon:'⚽'  },
  { name:'Shooting',   slug:'shooting',   icon:'🔫'  },
  { name:'Sci-Fi',     slug:'sci-fi',     icon:'🚀'  },
  { name:'Survival',   slug:'survival',   icon:'🏕️'  },
  { name:'Puzzle',     slug:'puzzle',     icon:'🧩'  },
  { name:'Old Games',  slug:'old-games',  icon:'🕹️'  },
  { name:'Action RPG', slug:'action-rpg', icon:'🗡️'  },
]

export default function CategoriesPage() {
  const [counts, setCounts] = useState<Record<string,number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/games')
      .then(r=>r.json())
      .then((games:any[])=>{
        if(!Array.isArray(games)) return
        const c: Record<string,number> = {}
        games.forEach(g=>{ c[g.category]=(c[g.category]||0)+1 })
        setCounts(c)
      })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  }, [])

  return (
    <div style={{background:'#f0f2f8',minHeight:'100vh'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:'54px',display:'flex',alignItems:'center'}}>
        <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>Categories</span>
        <span style={{marginLeft:'12px',fontSize:'12px',color:'#6b7280',background:'#f9fafb',border:'1px solid #e5e7eb',padding:'3px 10px',borderRadius:'6px'}}>{CATS.length} categories</span>
      </div>
      <div style={{padding:'24px'}}>
        <div style={{background:'#eef2ff',border:'1px solid #c7d2fe',borderRadius:'8px',padding:'12px 16px',marginBottom:'16px',fontSize:'13px',color:'#4f46e5'}}>
          ℹ️ Categories automatically games se create hoti hain. Game add karte waqt category select karo.
        </div>
        {loading ? (
          <div style={{textAlign:'center' as any,padding:'40px',color:'#6b7280'}}>Loading...</div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}}>
            {CATS.map(cat=>(
              <div key={cat.slug} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',padding:'16px',display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{fontSize:'28px',flexShrink:0}}>{cat.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'14px',fontWeight:600,color:'#111827'}}>{cat.name}</div>
                  <div style={{fontSize:'12px',color:'#6b7280',marginTop:'2px'}}>
                    <span style={{color:'#4f46e5',fontWeight:600}}>{counts[cat.name]||0}</span> games
                  </div>
                </div>
                <a href={`/games?category=${encodeURIComponent(cat.name)}`} target="_blank"
                  style={{fontSize:'11px',color:'#4f46e5',textDecoration:'none',background:'#eef2ff',padding:'4px 8px',borderRadius:'4px'}}>
                  View →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
