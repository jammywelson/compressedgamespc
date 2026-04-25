'use client'
import { useState, useEffect } from 'react'
export default function MenusPage() {
  const [menus, setMenus] = useState<Record<string,any[]>>({header:[],footer:[]})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeMenu, setActiveMenu] = useState('header')
  const [newItem, setNewItem] = useState({label:'',url:'',target:'_self'})
  useEffect(()=>{fetch('/api/settings?key=menus',{cache:'no-store'}).then(r=>r.json()).then((d:any)=>{if(d)setMenus(p=>({...p,...d}))}).catch(()=>{})},[])
  const save=async()=>{setSaving(true);const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'menus',value:menus})});if((await r.json()).ok){setSaved(true);setTimeout(()=>setSaved(false),3000)}setSaving(false)}
  const addItem=()=>{if(!newItem.label||!newItem.url)return alert('Label and URL required');setMenus(p=>({...p,[activeMenu]:[...p[activeMenu],{...newItem,id:Date.now()}]}));setNewItem({label:'',url:'',target:'_self'})}
  const removeItem=(idx:number)=>setMenus(p=>({...p,[activeMenu]:p[activeMenu].filter((_,i)=>i!==idx)}))
  const moveItem=(idx:number,dir:number)=>{const arr=[...menus[activeMenu]];const ni=idx+dir;if(ni<0||ni>=arr.length)return;[arr[idx],arr[ni]]=[arr[ni],arr[idx]];setMenus(p=>({...p,[activeMenu]:arr}))}
  const inp:any={border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px',fontSize:'14px',outline:'none',background:'#fff'}
  return(
    <div style={{padding:'24px',maxWidth:'800px',background:'#f8fafc',minHeight:'calc(100vh - 60px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{margin:0,fontSize:'22px',fontWeight:800}}>\u{1F4CB} Menu Builder</h1>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {saved&&<span style={{color:'#16a34a',fontWeight:700}}>\u2713 Saved!</span>}
          <button onClick={save} disabled={saving} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 24px',fontWeight:700,cursor:'pointer',boxShadow:'0 2px 8px rgba(99,102,241,.3)'}}>{saving?'Saving...':'Save Menus'}</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'4px',marginBottom:'20px',borderBottom:'2px solid #e2e8f0'}}>
        {['header','footer'].map(m=><button key={m} onClick={()=>setActiveMenu(m)} style={{padding:'10px 20px',border:'none',background:'transparent',cursor:'pointer',fontWeight:600,fontSize:'13px',color:activeMenu===m?'#6366f1':'#64748b',borderBottom:activeMenu===m?'2px solid #6366f1':'2px solid transparent',marginBottom:'-2px',textTransform:'capitalize'}}>{m} Menu</button>)}
      </div>
      <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'20px',marginBottom:'16px'}}>
        <h3 style={{margin:'0 0 16px',fontWeight:700}}>Add New Item</h3>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
          <input style={{...inp,flex:1,minWidth:'120px'}} placeholder="Label (e.g. Home)" value={newItem.label} onChange={e=>setNewItem(p=>({...p,label:e.target.value}))} />
          <input style={{...inp,flex:2,minWidth:'150px'}} placeholder="URL (e.g. /games)" value={newItem.url} onChange={e=>setNewItem(p=>({...p,url:e.target.value}))} />
          <select style={inp} value={newItem.target} onChange={e=>setNewItem(p=>({...p,target:e.target.value}))}><option value="_self">Same Tab</option><option value="_blank">New Tab</option></select>
          <button onClick={addItem} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 16px',cursor:'pointer',fontWeight:700}}>Add \u2795</button>
        </div>
      </div>
      <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
        {menus[activeMenu]?.length===0?<p style={{padding:'32px',textAlign:'center',color:'#94a3b8'}}>No items in {activeMenu} menu. Add some above!</p>:
          menus[activeMenu]?.map((item:any,i:number)=>(
            <div key={item.id||i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderBottom:'1px solid #f8fafc',background:'#fff'}}>
              <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                <button onClick={()=>moveItem(i,-1)} disabled={i===0} style={{background:'none',border:'none',cursor:i===0?'default':'pointer',color:i===0?'#e2e8f0':'#94a3b8',fontSize:'12px',padding:'0',lineHeight:1}}>\u25B2</button>
                <button onClick={()=>moveItem(i,1)} disabled={i===menus[activeMenu].length-1} style={{background:'none',border:'none',cursor:i===menus[activeMenu].length-1?'default':'pointer',color:i===menus[activeMenu].length-1?'#e2e8f0':'#94a3b8',fontSize:'12px',padding:'0',lineHeight:1}}>\u25BC</button>
              </div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontWeight:600,fontSize:'14px'}}>{item.label}</p>
                <p style={{margin:'2px 0 0',fontSize:'12px',color:'#94a3b8',fontFamily:'monospace'}}>{item.url} \u2022 {item.target}</p>
              </div>
              <button onClick={()=>removeItem(i)} style={{background:'#fff1f2',border:'none',borderRadius:'6px',padding:'5px 10px',cursor:'pointer',color:'#e11d48',fontWeight:700,fontSize:'12px'}}>Remove</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}