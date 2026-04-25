import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms' }

export default function Page() {
  const title = 'Terms'
  return (
    <>
      
      <main style={{ maxWidth:'760px', margin:'0 auto', padding:'40px 24px' }}>
        <h1 style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'32px', fontWeight:700, color:'#111827', marginBottom:'8px' }}>{title}</h1>
        <div style={{ width:'50px', height:'4px', background:'#4f46e5', borderRadius:'2px', marginBottom:'28px' }}/>
        <div style={{ fontSize:'15px', color:'#374151', lineHeight:1.8 }}>
          <p>This page content is managed from <strong>Admin Panel â Pages Manager</strong>.</p>
          <p style={{ marginTop:'12px', color:'#6b7280', fontSize:'13px' }}>To edit this page: Go to /admin/pages and click Edit on this page.</p>
        </div>
      </main>
      
    </>
  )
}
