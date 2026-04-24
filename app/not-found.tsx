// app/not-found.tsx
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth:'600px', margin:'80px auto', padding:'0 24px', textAlign:'center' as any }}>
        <div style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'120px', fontWeight:700, color:'#e5e7eb', lineHeight:1 }}>404</div>
        <h1 style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'28px', fontWeight:700, color:'#111827', marginBottom:'12px' }}>Page Not Found</h1>
        <p style={{ color:'#6b7280', marginBottom:'24px', fontSize:'15px' }}>The page you are looking for does not exist or has been moved.</p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
          <Link href="/" style={{ background:'#4f46e5', color:'#fff', borderRadius:'8px', padding:'10px 24px', fontSize:'14px', fontWeight:600 }}>Go Home</Link>
          <Link href="/games" style={{ background:'#fff', color:'#4f46e5', border:'1px solid #4f46e5', borderRadius:'8px', padding:'10px 24px', fontSize:'14px', fontWeight:600 }}>Browse Games</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
