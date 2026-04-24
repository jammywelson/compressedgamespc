'use client'
import { useState } from 'react'

export default function BackupPage() {
  const [creating, setCreating] = useState(false)
  const [msg, setMsg] = useState('')

  const createBackup = async () => {
    setCreating(true); setMsg('')
    try {
      // Fetch all data
      const [games, users, settings] = await Promise.all([
        fetch('/api/games').then(r=>r.json()),
        fetch('/api/users').then(r=>r.json()),
        fetch('/api/settings').then(r=>r.json()),
      ])

      const backup = {
        version: '1.0',
        date: new Date().toISOString(),
        site: 'compressedgamespc.com',
        data: { games, users, settings }
      }

      // Download as JSON file
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type:'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cgpc_backup_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      setMsg(`✓ Backup created! Games: ${Array.isArray(games)?games.length:0}, Users: ${Array.isArray(users)?users.length:0}`)
    } catch(e: any) {
      setMsg('Error: ' + e.message)
    }
    setCreating(false)
  }

  return (
    <div style={{background:'#f0f2f8',minHeight:'100vh'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:'54px',display:'flex',alignItems:'center'}}>
        <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>Backup & Restore</span>
      </div>
      <div style={{padding:'24px',maxWidth:'600px'}}>

        {/* Create Backup */}
        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',padding:'24px',marginBottom:'16px'}}>
          <div style={{fontSize:'16px',fontWeight:700,color:'#111827',marginBottom:'8px'}}>💾 Create Backup</div>
          <div style={{fontSize:'13px',color:'#6b7280',marginBottom:'16px'}}>
            Sab games, users aur settings ka JSON backup download hoga. Safe rakh lain!
          </div>
          <button onClick={createBackup} disabled={creating}
            style={{background:creating?'#9ca3af':'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'12px 24px',fontSize:'14px',fontWeight:600,cursor:creating?'not-allowed':'pointer',fontFamily:'inherit'}}>
            {creating?'Creating...':'⬇ Download Backup Now'}
          </button>
          {msg&&<div style={{marginTop:'12px',fontSize:'13px',color:msg.startsWith('✓')?'#16a34a':'#e53935',background:msg.startsWith('✓')?'#f0fdf4':'#fef2f2',padding:'10px',borderRadius:'6px'}}>{msg}</div>}
        </div>

        {/* Info */}
        <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'10px',padding:'16px',marginBottom:'16px'}}>
          <div style={{fontSize:'14px',fontWeight:600,color:'#92400e',marginBottom:'8px'}}>ℹ️ Database Backup</div>
          <div style={{fontSize:'13px',color:'#92400e',lineHeight:1.6}}>
            Supabase automatically daily backups leta hai aapka database. Aap yahan se manual backup bhi le sakte hain jab chahein.
          </div>
        </div>

        {/* Supabase link */}
        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',padding:'20px'}}>
          <div style={{fontSize:'15px',fontWeight:700,color:'#111827',marginBottom:'8px'}}>🗄️ Database Backup (Supabase)</div>
          <div style={{fontSize:'13px',color:'#6b7280',marginBottom:'14px'}}>
            Supabase dashboard par jaake database ka direct backup le sakte hain.
          </div>
          <a href="https://supabase.com/dashboard/project/qfrqpkmewqqxabyjflxp/database/backups" target="_blank"
            style={{background:'#1a1f3c',color:'#fff',borderRadius:'8px',padding:'10px 20px',fontSize:'13px',fontWeight:600,textDecoration:'none',display:'inline-block'}}>
            Open Supabase Backups ↗
          </a>
        </div>
      </div>
    </div>
  )
}
