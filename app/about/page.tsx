import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About CompressedGamesPC â Your #1 source for highly compressed PC games.',
}

export default function AboutPage() {
  return (
    <>
      
      <main style={{ maxWidth:'760px', margin:'0 auto', padding:'40px 24px' }}>
        <h1 style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'32px', fontWeight:700, color:'#111827', marginBottom:'8px' }}>About Us</h1>
        <div style={{ width:'50px', height:'4px', background:'#4f46e5', borderRadius:'2px', marginBottom:'28px' }}/>
        <div style={{ fontSize:'15px', color:'#374151', lineHeight:1.8 }}>
          <p style={{ marginBottom:'16px' }}>
            <strong>CompressedGamesPC</strong> is your #1 source for highly compressed PC games. We provide free direct download links for PC games with maximum compression to save your storage and bandwidth.
          </p>
          <h2 style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'22px', fontWeight:700, color:'#111827', margin:'24px 0 10px' }}>Our Mission</h2>
          <p style={{ marginBottom:'16px' }}>
            We compress the latest PC games using advanced compression tools, reducing file sizes by up to 80% without any quality loss. Our goal is to make gaming accessible to everyone, even those with limited internet speed or storage.
          </p>
          <h2 style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'22px', fontWeight:700, color:'#111827', margin:'24px 0 10px' }}>What We Offer</h2>
          <ul style={{ paddingLeft:'20px', marginBottom:'16px', display:'flex', flexDirection:'column', gap:'6px' }}>
            {['Latest PC games highly compressed','Direct download links â no surveys, no ads','Fast download servers with multiple mirrors','Regular updates with new game releases','System requirements for every game'].map(item => (
              <li key={item} style={{ color:'#374151' }}>{item}</li>
            ))}
          </ul>
          <h2 style={{ fontFamily:'Rajdhani, sans-serif', fontSize:'22px', fontWeight:700, color:'#111827', margin:'24px 0 10px' }}>Contact</h2>
          <p>For any queries, reach us at: <a href="mailto:admin@compressedgamespc.com" style={{ color:'#4f46e5' }}>admin@compressedgamespc.com</a></p>
        </div>
      </main>
      
    </>
  )
}
