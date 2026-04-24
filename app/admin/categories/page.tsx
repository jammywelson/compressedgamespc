'use client'
import { useState, useEffect } from 'react'

const SI:React.CSSProperties={width:'100%',background:'#fff',border:'1px solid #e5e7eb',borderRadius:'7px',padding:'9px 12px',color:'#111827',fontSize:'13px',outline:'none',fontFamily:'inherit'}
const LB:React.CSSProperties={fontSize:'12px',color:'#374151',fontWeight:500,marginBottom:'5px',display:'block'}

const STARTER=[
  {id:'action',name:'Action',slug:'action',icon:'⚔️',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'fighting',name:'Fighting',slug:'fighting',icon:'🥊',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'strategy',name:'Strategy',slug:'strategy',icon:'♟️',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'horror',name:'Horror',slug:'horror',icon:'👻',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'adventure',name:'Adventure',slug:'adventure',icon:'🗺️',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'racing',name:'Racing',slug:'racing',icon:'🏎️',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'simulation',name:'Simulation',slug:'simulation',icon:'🏙️',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'sports',name:'Sports',slug:'sports',icon:'⚽',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'shooting',name:'Shooting',slug:'shooting',icon:'🔫',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'sci-fi',name:'Sci-Fi',slug:'sci-fi',icon:'🚀',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'survival',name:'Survival',slug:'survival',icon:'🏕️',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'puzzle',name:'Puzzle',slug:'puzzle',icon:'🧩',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'old-games',name:'Old Games',slug:'old-games',icon:'🕹️',seoTitle:'',seoDesc:'',seoKeywords:''},
  {id:'action-rpg',name:'Action RPG',slug:'action-rpg',icon:'🗡️',seoTitle:'',seoDesc:'',seoKeywords:''},
]

export default function CategoriesPage(){
  const [cats,setCats]=useState<any[]>([])
  const [counts,setCounts]=useState<Record<string,number>>({})
  const [loading,setLoading]=useState(true)
  const [editCat,setEditCat]=useState<any|null>(null)
  const [showAdd,setShowAdd]=useState(false)
  const [newCat,setNewCat]=useState({name:'',slug:'',icon:'🎮'})
  const [msg,setMsg]=useState('')
  const [delId,setDelId]=useState<string|null>(null)
  const [saving,setSaving]=useState(false)

  useEffect(()=>{load()},[])

  const load=async()=>{
    setLoading(true)
    try{
      const [games,saved]=await Promise.all([
        fetch('/api/games').then(r=>r.json()).catch(()=>[]),
        fetch('/api/settings?key=categories').then(r=>r.json()).catch(()=>null)
      ])
      if(saved&&Array.isArray(saved)&&saved.length>0){
        setCats(saved.map((s:any)=>({
          id:s.id||s.slug,name:s.name||'',slug:s.slug||s.id||'',
          icon:s.icon||'🎮',seoTitle:s.seoTitle||'',seoDesc:s.seoDesc||'',seoKeywords:s.seoKeywords||''
        })))
      }else{setCats(STARTER);await saveToDb(STARTER)}
      if(Array.isArray(games)){
        const c:Record<string,number>={}
        games.forEach((g:any)=>{if(g.category)c[g.category]=(c[g.category]||0)+1})
        setCounts(c)
      }
    }catch(e){}
    setLoading(false)
  }

  const saveToDb=async(v:any[])=>fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'categories',value:v})})
  const saveAll=async(v:any[])=>{setCats(v);await saveToDb(v)}
  const showMsg=(m:string)=>{setMsg(m);setTimeout(()=>setMsg(''),2500)}

  const addCat=async()=>{
    if(!newCat.name.trim())return
    setSaving(true)
    const slug=newCat.slug||newCat.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
    await saveAll([...cats,{id:slug,name:newCat.name.trim(),slug,icon:newCat.icon,seoTitle:'',seoDesc:'',seoKeywords:''}])
    setNewCat({name:'',slug:'',icon:'🎮'});setShowAdd(false);showMsg('Category add ho gayi!');setSaving(false)
  }

  const saveEdit=async()=>{
    if(!editCat)return;setSaving(true)
    await saveAll(cats.map(c=>c.id===editCat.id?editCat:c))
    setEditCat(null);showMsg('Updated!');setSaving(false)
  }

  const deleteCat=async(id:string)=>{
    await saveAll(cats.filter(c=>c.id!==id))
    setDelId(null);showMsg('Delete ho gayi!')
  }

  return(
    <div style={{background:'#f0f2f8',minHeight:'100vh'}}>
      {delId&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'12px',padding:'24px',width:'320px',textAlign:'center' as any}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>🗑</div>
            <div style={{fontSize:'16px',fontWeight:700,marginBottom:'18px'}}>Delete "{cats.find(c=>c.id===delId)?.name}"?</div>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={()=>setDelId(null)} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:'8px',padding:'10px',cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
              <button onClick={()=>deleteCat(delId)} style={{flex:1,background:'#e53935',color:'#fff',border:'none',borderRadius:'8px',padding:'10px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {editCat&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
          <div style={{background:'#fff',borderRadius:'12px',width:'100%',maxWidth:'580px',maxHeight:'90vh',overflow:'auto'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #e5e7eb',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:'#fff'}}>
              <div style={{fontSize:'16px',fontWeight:700}}>Edit — {editCat.name}</div>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setEditCat(null)} style={{background:'#f3f4f6',border:'none',borderRadius:'7px',padding:'7px 14px',cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
                <button onClick={saveEdit} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'7px 16px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{saving?'Saving...':'Save'}</button>
              </div>
            </div>
            <div style={{padding:'20px',display:'grid',gap:'14px'}}>
              <div style={{display:'grid',gridTemplateColumns:'70px 1fr 1fr',gap:'12px'}}>
                <div><label style={LB}>Icon</label><input style={{...SI,textAlign:'center' as any,fontSize:'20px'}} value={editCat.icon} onChange={e=>setEditCat({...editCat,icon:e.target.value})}/></div>
                <div><label style={LB}>Name</label><input style={SI} value={editCat.name} onChange={e=>setEditCat({...editCat,name:e.target.value})}/></div>
                <div><label style={LB}>Slug</label><input style={{...SI,color:'#0891b2'}} value={editCat.slug} onChange={e=>setEditCat({...editCat,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')})} /></div>
              </div>
              <div style={{borderTop:'1px solid #f3f4f6',paddingTop:'14px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'10px'}}>🔍 SEO Settings</div>
                <div style={{display:'grid',gap:'10px'}}>
                  <div>
                    <label style={LB}>SEO Title</label>
                    <input style={SI} value={editCat.seoTitle} onChange={e=>setEditCat({...editCat,seoTitle:e.target.value})} placeholder="SEO Title — 60 chars max"/>
                    <div style={{fontSize:'10px',color:(editCat.seoTitle?.length||0)>60?'#e53935':'#9ca3af',marginTop:'2px'}}>{editCat.seoTitle?.length||0}/60</div>
                  </div>
                  <div>
                    <label style={LB}>Meta Description</label>
                    <textarea style={{...SI,minHeight:'70px',resize:'vertical' as any}} value={editCat.seoDesc} onChange={e=>setEditCat({...editCat,seoDesc:e.target.value})} placeholder="Meta description — 160 chars max"/>
                    <div style={{fontSize:'10px',color:(editCat.seoDesc?.length||0)>160?'#e53935':'#9ca3af',marginTop:'2px'}}>{editCat.seoDesc?.length||0}/160</div>
                  </div>
                  <div>
                    <label style={LB}>Keywords</label>
                    <input style={SI} value={editCat.seoKeywords} onChange={e=>setEditCat({...editCat,seoKeywords:e.target.value})} placeholder="keyword1, keyword2"/>
                    <div style={{display:'flex',gap:'4px',flexWrap:'wrap' as any,marginTop:'6px'}}>
                      {[editCat.name.toLowerCase()+' download',editCat.name.toLowerCase()+' highly compressed','free '+editCat.name.toLowerCase()+' pc'].map((kw:string)=>(
                        <button key={kw} onClick={()=>setEditCat({...editCat,seoKeywords:editCat.seoKeywords?editCat.seoKeywords+', '+kw:kw})}
                          style={{background:'#eef2ff',color:'#4f46e5',border:'1px solid #c7d2fe',borderRadius:'4px',padding:'2px 8px',fontSize:'11px',cursor:'pointer',fontFamily:'inherit'}}>+{kw}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px',height:'54px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>Categories</span>
        <span style={{fontSize:'12px',color:'#6b7280',background:'#f9fafb',border:'1px solid #e5e7eb',padding:'3px 10px',borderRadius:'6px'}}>{cats.length} categories</span>
        {msg&&<span style={{fontSize:'12px',color:'#16a34a',fontWeight:600}}>{msg}</span>}
        <button onClick={()=>setShowAdd(!showAdd)} style={{marginLeft:'auto',background:'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'8px 16px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
          {showAdd?'✕ Cancel':'+ Add Category'}
        </button>
      </div>
      <div style={{padding:'24px'}}>
        {showAdd&&(
          <div style={{background:'#fff',border:'1px solid #c7d2fe',borderRadius:'10px',padding:'20px',marginBottom:'16px'}}>
            <div style={{fontSize:'15px',fontWeight:700,color:'#111827',marginBottom:'14px'}}>Add New Category</div>
            <div style={{display:'grid',gridTemplateColumns:'70px 1fr 1fr auto',gap:'12px',alignItems:'flex-end'}}>
              <div><label style={LB}>Icon</label><input style={{...SI,textAlign:'center' as any,fontSize:'20px'}} value={newCat.icon} onChange={e=>setNewCat(n=>({...n,icon:e.target.value}))} /></div>
              <div><label style={LB}>Name *</label><input style={SI} value={newCat.name} onChange={e=>setNewCat(n=>({...n,name:e.target.value,slug:e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}))} autoFocus/></div>
              <div><label style={LB}>Slug</label><input style={{...SI,color:'#0891b2'}} value={newCat.slug} onChange={e=>setNewCat(n=>({...n,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')}))} /></div>
              <button onClick={addCat} disabled={saving} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'7px',padding:'9px 20px',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit',height:'38px'}}>{saving?'...':'Add'}</button>
            </div>
          </div>
        )}
        {loading?(
          <div style={{textAlign:'center' as any,padding:'40px',color:'#6b7280'}}>Loading...</div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:'12px'}}>
            {cats.map(cat=>(
              <div key={cat.id} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'10px',padding:'16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                  <div style={{fontSize:'28px'}}>{cat.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'14px',fontWeight:600,color:'#111827'}}>{cat.name}</div>
                    <div style={{fontSize:'11px',color:'#9ca3af'}}>/{cat.slug}</div>
                    <div style={{fontSize:'12px',color:'#6b7280'}}><span style={{color:'#4f46e5',fontWeight:600}}>{counts[cat.name]||0}</span> games</div>
                  </div>
                </div>
                {cat.seoTitle&&<div style={{fontSize:'10px',color:'#16a34a',marginBottom:'8px',background:'#f0fdf4',padding:'3px 6px',borderRadius:'4px'}}>✓ SEO set</div>}
                <div style={{display:'flex',gap:'6px'}}>
                  <button onClick={()=>setEditCat({...cat})} style={{flex:1,background:'#eef2ff',color:'#4f46e5',border:'1px solid #c7d2fe',borderRadius:'5px',padding:'5px',fontSize:'11px',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>Edit+SEO</button>
                  <button onClick={()=>setDelId(cat.id)} style={{background:'#fef2f2',color:'#e53935',border:'1px solid #fca5a5',borderRadius:'5px',padding:'5px 8px',fontSize:'11px',cursor:'pointer',fontFamily:'inherit'}}>Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
