'use client'
import { useState, useEffect } from 'react'
export default function MediaPage() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState('')
  const load=async()=>{setLoading(true);try{const r=await fetch('/api/admin/media');if(r.ok)setFiles(await r.json())}catch{}setLoading(false)}
  useEffect(()=>{load()},[])
  const upload=async(e:any)=>{const f=e.target.files?.[0];if(!f)return;setUploading(true);const fd=new FormData();fd.append('file',f);try{const r=await fetch('/api/upload',{method:'POST',body:fd});const d=await r.json();if(d.url){setFiles(p=>[{id:Date.now(),name:f.name,url:d.url,type:f.type.startsWith('image')?'image':'file',size:f.size,createdAt:new Date().toISOString()},...p])}}catch(err){alert('Upload failed')}setUploading(false);e.target.value=''}
  const copy=(url:string)=>{navigator.clipboard.writeText(url).then(()=>{setCopied(url);setTimeout(()=>setCopied(''),2000)})}
  const filtered=files.filter(f=>f.name?.toLowerCase().includes(search.toLowerCase())||f.url?.toLowerCase().includes(search.toLowerCase()))
  return(
    <div style={{padding:'24px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:800}}>\u{1F5BC}\uFE0F Media Library</h1>
        <label style={{display:'flex',alignItems:'center',gap:'8px',background:'#6366f1',color:'#fff',padding:'10px 20px',borderRadius:'8px',cursor:'pointer',fontWeight:700,fontSize:'14px',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>
          <span>{uploading?'Uploading...':'\u2B06\uFE0F Upload File'}</span>
          <input type="file" onChange={upload} disabled={uploading} style={{display:'none'}} accept="image/*,video/*,.zip,.rar" />
        </label>
      </div>
      <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'16px',marginBottom:'16px'}}>
        <input style={{width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#f8fafc'}} placeholder="\u{1F50D} Search files..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      {loading?<p style={{textAlign:'center',color:'#94a3b8',padding:'40px'}}>Loading...</p>:
        filtered.length===0?(<div style={{textAlign:'center',padding:'60px',background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0'}}>
          <p style={{fontSize:'40px',margin:'0 0 12px'}}>\u{1F5BC}\uFE0F</p>
          <p style={{color:'#94a3b8',margin:0}}>No media files yet. Upload your first file!</p>
        </div>):
        (<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}}>
          {filtered.map((f:any)=>(
            <div key={f.id||f.url} style={{background:'#fff',borderRadius:'10px',border:'1px solid #e2e8f0',overflow:'hidden',transition:'box-shadow .15s'}}>
              {f.type==='image'||f.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)?
                <img src={f.url} alt={f.name} style={{width:'100%',height:'140px',objectFit:'cover'}} onError={e=>(e.target as any).style.display='none'} />:
                <div style={{width:'100%',height:'140px',background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px'}}>\u{1F4C4}</div>
              }
              <div style={{padding:'10px'}}>
                <p style={{margin:0,fontWeight:600,fontSize:'12px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#374151'}}>{f.name}</p>
                <div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
                  <button onClick={()=>copy(f.url)} style={{flex:1,padding:'5px 8px',borderRadius:'6px',background:copied===f.url?'#dcfce7':'#f1f5f9',color:copied===f.url?'#16a34a':'#475569',border:'none',cursor:'pointer',fontSize:'11px',fontWeight:700}}>
                    {copied===f.url?'\u2713 Copied!':'\u{1F4CB} Copy URL'}
                  </button>
                  <a href={f.url} target="_blank" style={{padding:'5px 8px',borderRadius:'6px',background:'#eff6ff',color:'#2563eb',textDecoration:'none',fontSize:'11px',fontWeight:700}}>View</a>
                </div>
              </div>
            </div>
          ))}
        </div>)
      }
      <p style={{marginTop:'16px',padding:'10px 16px',background:'#f0f9ff',borderRadius:'8px',color:'#0369a1',fontSize:'13px'}}>\u2139\uFE0F Note: Uploaded files are stored using your configured upload API. Connect Cloudinary or S3 for persistent storage in production.</p>
    </div>
  )
}