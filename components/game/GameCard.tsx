'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { Game } from '@/types'

export default function GameCard({ game }: { game: Game }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/games/${game.slug}`}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ background:'#fff', border:`1px solid ${hovered?'#4f46e5':'#e5e7eb'}`, borderRadius:'10px', overflow:'hidden', display:'block', transition:'all .2s', transform:hovered?'translateY(-2px)':'translateY(0)', boxShadow:hovered?'0 6px 20px rgba(79,70,229,.12)':'0 1px 3px rgba(0,0,0,.05)' }}>
      <div style={{ position:'relative', aspectRatio:'3/4', background:'linear-gradient(135deg,#1a1f3c,#252b4a)', overflow:'hidden' }}>
        <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,.3)', fontSize:'11px', textAlign:'center' as any, padding:'8px' }}>
          {game.title}
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top,rgba(0,0,0,.8),transparent)', padding:'6px 7px 4px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:'8px', background:'#16a34a', color:'#fff', padding:'1px 5px', borderRadius:'3px', fontWeight:700 }}>COMPRESSED</span>
            <span style={{ fontSize:'9px', color:'rgba(255,255,255,.9)', fontWeight:700 }}>{game.size}</span>
          </div>
        </div>
        {game.status==='hot' && <div style={{ position:'absolute', top:'5px', right:'5px', background:'#e53935', color:'#fff', fontSize:'8px', fontWeight:700, padding:'2px 5px', borderRadius:'3px' }}>HOT</div>}
      </div>
      <div style={{ padding:'7px 9px 9px' }}>
        <div style={{ fontSize:'11px', fontWeight:600, color:'#111827', whiteSpace:'nowrap' as any, overflow:'hidden', textOverflow:'ellipsis', marginBottom:'2px' }}>{game.title}</div>
        <div style={{ fontSize:'10px', color:'#4f46e5' }}>{game.category}</div>
        {game.rating && (
          <div style={{ display:'flex', alignItems:'center', gap:'2px', marginTop:'3px' }}>
            {[1,2,3,4,5].map(i=><span key={i} style={{fontSize:'10px',color:i<=Math.round(game.rating!)?'#fbbf24':'#e5e7eb'}}>{i<=Math.round(game.rating!)?'★':'☆'}</span>)}
          </div>
        )}
      </div>
    </Link>
  )
}
