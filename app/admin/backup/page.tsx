'use client'
import { useState } from 'react'
export default function BackupPage() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{type:'success'|'error',text:string}|null>(null)
  const exportDB=async()=>{setLoading(true);setMsg(null);try{const r=await fetch('/api/admin/backup/export');if(r.ok){const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='cgpc-backup-'+new Date().toISOString().split('T')[0]+'.json';a.click();setMsg({type:'success',text:'\u2713 Backup exported successfully!'});}else setMsg({type:'error',text:'\u2717 Export failed. Try again.'})}catch(e){setMsg({type:'error',text:'\u2717 Error: '+String(e)})}setLoading(false)}
  const importDB=async(e:any)=>{const file=e.target.files?.[0];if(!file)return;setLoading(true);setMsg(null);try{const text=await file.text();const r=await fetch('/api/admin/backup/import',{method:'POST',headers:{'Content-Type':'application/json'},body:text});const d=await r.json();setMsg(d.ok?{type:'success',text:'\u2713 Import successful! '+d.count+' records restored.'}:{type:'error',text:'\u2717 Import failed: '+(d.error||'Unknown')})}catch(e){setMsg({type:'error',text:'\u2717 Error: '+String(e)})}setLoading(false);e.target.value=''}
  const card:any={background:'#fff',borderRadius:'12px',padding:'24px',border:'1px solid #e2e8f0',marginBottom:'16px'}
  return(
    <div style={{padding:'24px',maxWidth:'700px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <h1 style={{margin:'0 0 24px',fontSize:'22px',fontWeight:800}}>\u{1F4BE} Backup & Restore</h1>
      {msg&&<div style={{padding:'12px 16px',borderRadius:'10px',marginBottom:'16px',background:msg.type==='success'?'#dcfce7':'#fee2e2',color:msg.type==='success'?'#16a34a':'#dc2626',fontWeight:600,fontSize:'14px'}}>{msg.text}</div>}
      <div style={card}>
        <h3 style={{margin:'0 0 8px',fontWeight:700}}>\u{1F4E4} Export Database</h3>
        <p style={{color:'#64748b',fontSize:'14px',margin:'0 0 16px',lineHeight:1.6}}>Download a complete backup of all games, categories, settings, users, and comments as a JSON file.</p>
        <button onClick={exportDB} disabled={loading} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',fontSize:'14px',boxShadow:'0 2px 8px rgba(99,102,241,.3)',display:'flex',alignItems:'center',gap:'8px'}}>
          {loading?'Exporting...':'\u{1F4E5} Export Backup'}
        </button>
      </div>
      <div style={card}>
        <h3 style={{margin:'0 0 8px',fontWeight:700}}>\u{1F4E5} Import / Restore</h3>
        <p style={{color:'#64748b',fontSize:'14px',margin:'0 0 16px',lineHeight:1.6}}>Restore data from a previously exported JSON backup file. Settings and categories will be upserted.</p>
        <div style={{border:'2px dashed #e2e8f0',borderRadius:'10px',padding:'24px',textAlign:'center',background:'#f8fafc'}}>
          <p style={{margin:'0 0 12px',color:'#64748b',fontSize:'14px'}}>\u{1F4C2} Select a backup JSON file to import</p>
          <input type="file" accept=".json" onChange={importDB} disabled={loading} style={{cursor:'pointer',fontSize:'14px'}} />
        </div>
      </div>
      <div style={{...card,background:'#fffbeb',border:'1px solid #fbbf24'}}>
        <p style={{margin:0,color:'#92400e',fontSize:'13px',lineHeight:1.6}}>\u26A0\uFE0F <b>Warning:</b> Importing a backup will overwrite existing settings and categories. Always export a fresh backup before importing.</p>
      </div>
    </div>
  )
}