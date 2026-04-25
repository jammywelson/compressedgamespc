'use client'
import { useState } from 'react'
export default function BackupPage() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const exportDB = async () => {
    setLoading(true); setMsg('')
    const r = await fetch('/api/admin/backup/export')
    if (r.ok) {
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href=url; a.download='cgpc-backup-'+new Date().toISOString().split('T')[0]+'.json'; a.click()
      setMsg('Backup exported successfully!')
    } else setMsg('Export failed')
    setLoading(false)
  }

  const importDB = async (e:any) => {
    const file = e.target.files?.[0]; if(!file) return
    setLoading(true); setMsg('')
    const text = await file.text()
    const r = await fetch('/api/admin/backup/import',{method:'POST',headers:{'Content-Type':'application/json'},body:text})
    const d = await r.json()
    setMsg(d.ok?'Import successful! '+d.count+' records imported.':'Import failed: '+(d.error||'Unknown'))
    setLoading(false)
  }

  const card:any={background:'#fff',borderRadius:'12px',padding:'24px',border:'1px solid #e2e8f0',marginBottom:'16px'}
  return (
    <div style={{padding:'20px',maxWidth:'700px'}}>
      <h1 style={{margin:'0 0 20px',fontSize:'22px',fontWeight:700}}>&#128190; Backup & Restore</h1>
      {msg&&<div style={{padding:'12px 16px',borderRadius:'8px',marginBottom:'16px',background:msg.includes('fail')?'#fee2e2':'#d1fae5',color:msg.includes('fail')?'#991b1b':'#065f46',fontWeight:600}}>{msg}</div>}
      <div style={card}>
        <h3 style={{margin:'0 0 8px',fontWeight:700}}>Export Database</h3>
        <p style={{color:'#64748b',fontSize:'14px',margin:'0 0 16px'}}>Download complete backup as JSON (games, categories, settings, users).</p>
        <button onClick={exportDB} disabled={loading} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer'}}>{loading?'Exporting...':'Export Backup'}</button>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 8px',fontWeight:700}}>Import / Restore</h3>
        <p style={{color:'#64748b',fontSize:'14px',margin:'0 0 12px'}}>Restore from a previously exported JSON backup file.</p>
        <div style={{padding:'16px',border:'2px dashed #e2e8f0',borderRadius:'8px',textAlign:'center'}}>
          <p style={{margin:'0 0 8px',color:'#64748b',fontSize:'14px'}}>Select backup JSON file</p>
          <input type="file" accept=".json" onChange={importDB} style={{cursor:'pointer'}} />
        </div>
      </div>
      <div style={{background:'#fef3c7',borderRadius:'8px',padding:'12px 16px',border:'1px solid #fbbf24'}}>
        <p style={{margin:0,color:'#92400e',fontSize:'13px'}}>Warning: Import will overwrite existing data. Export backup before importing.</p>
      </div>
    </div>
  )
}