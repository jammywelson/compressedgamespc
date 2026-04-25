'use client'
import Link from 'next/link'

const FCATS = ['Action','Fighting','Strategy','Horror','Adventure','Racing','Simulation','Sports','Sci-Fi','Survival','Puzzle','Old Games']

const FDEFS: Record<string,any> = {
  footerBg:'#1a1f3c', footerText:'\u00a9 2026 CompressedGamesPC.com',
  footerAbout:'Your #1 source for highly compressed PC games. Free direct download links, no surveys.',
  siteName:'CompressedGamesPC', socialFacebook:'', socialTelegram:'', socialYoutube:'', socialDiscord:'',
  showAbout:true, showContact:true, showPrivacy:true, showDisclaimer:true, showDmca:true, showTerms:true,
  footerShowBrand:true, footerShowCats1:true, footerShowCats2:true, footerShowLinks:true, footerShowCopyright:true, footerShowSocial:true,
}

export default function FooterClient({ initialSettings = {} }: { initialSettings?: Record<string,any> }) {
  const fc: Record<string,any> = { ...FDEFS, ...initialSettings }
  const pages: [string,string,boolean][] = [
    ['/about','About Us',!!fc.showAbout],['/contact','Contact',!!fc.showContact],['/privacy','Privacy Policy',!!fc.showPrivacy],
    ['/disclaimer','Disclaimer',!!fc.showDisclaimer],['/dmca','DMCA',!!fc.showDmca],['/terms','Terms',!!fc.showTerms],
  ]
  const lnk: any = { color:'#94a3b8', textDecoration:'none', fontSize:'13px', display:'block', marginBottom:'8px' }
  const hd: any = { color:'#e2e8f0', fontWeight:700, fontSize:'14px', marginBottom:'14px', paddingBottom:'8px', borderBottom:'1px solid rgba(255,255,255,.1)' }
  return (
    <footer style={{ background:fc.footerBg||'#1a1f3c', padding:'48px 24px 24px', marginTop:'auto' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'32px', marginBottom:'40px' }}>
          {fc.footerShowBrand && (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' }}>
                <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius:'6px', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'13px' }}>CGP</div>
                <span style={{ color:'#fff', fontWeight:700, fontSize:'15px' }}>{fc.siteName}</span>
              </div>
              <p style={{ color:'#94a3b8', fontSize:'13px', lineHeight:1.7, margin:'0 0 16px' }}>{fc.footerAbout}</p>
              {fc.footerShowSocial && (
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' as any }}>
                  {fc.socialFacebook && <a href={fc.socialFacebook} target="_blank" rel="noopener" style={{ color:'#94a3b8', fontSize:'12px', background:'rgba(255,255,255,.08)', padding:'5px 10px', borderRadius:'6px', textDecoration:'none' }}>Facebook</a>}
                  {fc.socialTelegram && <a href={fc.socialTelegram} target="_blank" rel="noopener" style={{ color:'#94a3b8', fontSize:'12px', background:'rgba(255,255,255,.08)', padding:'5px 10px', borderRadius:'6px', textDecoration:'none' }}>Telegram</a>}
                  {fc.socialYoutube && <a href={fc.socialYoutube} target="_blank" rel="noopener" style={{ color:'#94a3b8', fontSize:'12px', background:'rgba(255,255,255,.08)', padding:'5px 10px', borderRadius:'6px', textDecoration:'none' }}>YouTube</a>}
                  {fc.socialDiscord && <a href={fc.socialDiscord} target="_blank" rel="noopener" style={{ color:'#94a3b8', fontSize:'12px', background:'rgba(255,255,255,.08)', padding:'5px 10px', borderRadius:'6px', textDecoration:'none' }}>Discord</a>}
                </div>
              )}
            </div>
          )}
          {fc.footerShowCats1 && (<div><div style={hd}>Games</div>{FCATS.slice(0,6).map(c=><Link key={c} href={'/games?category='+encodeURIComponent(c)} style={lnk}>{c}</Link>)}</div>)}
          {fc.footerShowCats2 && (<div><div style={hd}>More Games</div>{FCATS.slice(6).map(c=><Link key={c} href={'/games?category='+encodeURIComponent(c)} style={lnk}>{c}</Link>)}</div>)}
          {fc.footerShowLinks && (
            <div><div style={hd}>Quick Links</div>
              <Link href="/games" style={lnk}>All Games</Link>
              <Link href="/games?status=hot" style={lnk}>Hot Games</Link>
              <Link href="/games?sort=new" style={lnk}>New Games</Link>
              {pages.filter(([,,s])=>s).map(([href,label])=><Link key={href} href={href} style={lnk}>{label}</Link>)}
            </div>
          )}
        </div>
        {fc.footerShowCopyright && (
          <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:'20px', textAlign:'center', color:'#64748b', fontSize:'13px' }}>
            {fc.footerText}
          </div>
        )}
      </div>
    </footer>
  )
}