'use client'
import { useState } from 'react'

export default function BackupPage() {
  const [exporting, setExporting] = useState(false)
  const [msg, setMsg] = useState('')

  const exportData = async () => {
    setExporting(true); setMsg('')
    try {
      const r = await fetch('/api/admin/backup/export')
      if (!r.ok) throw new Error('Export failed')
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'backup-' + new Date().toISOString().split('T')[0] + '.json'
      a.click(); URL.revokeObjectURL(url)
      setMsg('\u2713 Export successful!')
    } catch(e) { setMsg('Export failed: ' + e) }
    setExporting(false)
  }

  const card: any = { background:'#fff', borderRadius:'12px', padding:'24px', boxShadow:'0 1px 3px rgba(0,0,0,.08)', marginBottom:'16px' }

  return (
    <div style={{ maxWidth:'700px' }}>
      <h1 style={{ margin:'0 0 20px', fontSize:'22px', fontWeight:700, color:'#0f172a' }}>\ud83d\udcbe Backup & Restore</h1>
      {msg && <div style={{ padding:'12px 16px', borderRadius:'8px', background:msg.startsWith('\u2713')?'#dcfce7':'#fee2e2', color:msg.startsWith('\u2713')?'#16a34a':'#dc2626', marginBottom:'16px', fontWeight:600 }}>{msg}</div>}
      <div style={card}>
        <h3 style={{ margin:'0 0 8px', fontSize:'16px', fontWeight:700 }}>Export Database</h3>
        <p style={{ margin:'0 0 16px', color:'#64748b', fontSize:'14px' }}>Download a full JSON backup of all games, users, categories, settings, and comments.</p>
        <button onClick={exportData} disabled={exporting} style={{ background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', padding:'12px 24px', fontWeight:600, cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
          {exporting ? '\ud83d\udd04 Exporting...' : '\u2b07\ufe0f Download Backup'}
        </button>
      </div>
      <div style={card}>
        <h3 style={{ margin:'0 0 8px', fontSize:'16px', fontWeight:700 }}>Import / Restore</h3>
        <p style={{ margin:'0 0 16px', color:'#64748b', fontSize:'14px' }}>Upload a previously exported backup file to restore data.</p>
        <div style={{ padding:'32px', border:'2px dashed #e2e8f0', borderRadius:'8px', textAlign:'center', color:'#94a3b8' }}>
          <div style={{ fontSize:'32px', marginBottom:'8px' }}>\u{1F4C2}</div>
          <div style={{ fontSize:'14px' }}>Drag & drop backup JSON file here, or</div>
          <label style={{ display:'inline-block', marginTop:'10px', background:'#f1f5f9', color:'#374151', borderRadius:'8px', padding:'8px 16px', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>
            Browse File
            <input type='file' accept='.json' style={{ display:'none' }} onChange={async (e:any) => {
              const file = e.target.files?.[0]; if (!file) return
              const text = await file.text()
              const r = await fetch('/api/admin/backup/import', { method:'POST', headers:{'Content-Type':'application/json'}, body: text })
              const d = await r.json()
              setMsg(r.ok ? '\u2713 Restore successful! ' + (d.imported||0) + ' records imported.' : 'Import failed: ' + (d.error||'Unknown error'))
            }} />
          </label>
        </div>
      </div>
      <div style={card}>
        <h3 style={{ margin:'0 0 8px', fontSize:'16px', fontWeight:700 }}>Database Info</h3>
        <div style={{ fontSize:'13px', color:'#64748b' }}>Provider: PostgreSQL via Prisma</div>
        <div style={{ fontSize:'13px', color:'#64748b', marginTop:'4px' }}>Hosting: Vercel + Supabase/Neon</div>
      </div>
    </div>
  )
}