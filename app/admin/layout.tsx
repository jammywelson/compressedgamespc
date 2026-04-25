'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { section: 'MAIN', items: [
    { href: '/admin', icon: '\u{1F4CA}', label: 'Dashboard' },
  ]},
  { section: 'CONTENT', items: [
    { href: '/admin/games', icon: '\u{1F3AE}', label: 'Games', badge: 'new' },
    { href: '/admin/games/add', icon: '\u2795', label: 'Add Game' },
    { href: '/admin/categories', icon: '\u{1F4C2}', label: 'Categories' },
    { href: '/admin/tags', icon: '\u{1F3F7}', label: 'Tags' },
    { href: '/admin/pages', icon: '\u{1F4C4}', label: 'Pages' },
    { href: '/admin/media', icon: '\u{1F5BC}', label: 'Media Library' },
    { href: '/admin/comments', icon: '\u{1F4AC}', label: 'Comments' },
  ]},
  { section: 'DESIGN', items: [
    { href: '/admin/appearance', icon: '\u{1F3A8}', label: 'Appearance' },
    { href: '/admin/menus', icon: '\u{1F4CB}', label: 'Menus' },
    { href: '/admin/homepage', icon: '\u{1F3E0}', label: 'Homepage' },
  ]},
  { section: 'TOOLS', items: [
    { href: '/admin/seo', icon: '\u{1F50D}', label: 'SEO' },
    { href: '/admin/ads', icon: '\u{1F4B0}', label: 'Ads Manager' },
    { href: '/admin/downloads', icon: '\u{1F4E5}', label: 'Downloads' },
    { href: '/admin/analytics', icon: '\u{1F4C8}', label: 'Analytics' },
  ]},
  { section: 'ADMIN', items: [
    { href: '/admin/users', icon: '\u{1F465}', label: 'Users' },
    { href: '/admin/roles', icon: '\u{1F512}', label: 'Roles & Permissions' },
    { href: '/admin/security', icon: '\u{1F6E1}', label: 'Security' },
    { href: '/admin/settings', icon: '\u2699', label: 'Settings' },
    { href: '/admin/backup', icon: '\u{1F4BE}', label: 'Backup & Restore' },
  ]},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me').then(r => r.json()).then(d => {
      if (d.user) setUser(d.user)
      else if (pathname !== '/admin/login') router.push('/admin/login')
    }).catch(() => { if (pathname !== '/admin/login') router.push('/admin/login') })
  }, [pathname])

  if (pathname === '/admin/login') return <>{children}</>

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const sideW = collapsed ? '64px' : '240px'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Inter,-apple-system,sans-serif' }}>
      
      {/* Mobile overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 40 }} />}

      {/* SIDEBAR */}
      <aside style={{ width: sideW, minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50, transition: 'width .2s', overflow: 'hidden' }}>
        
        {/* Logo */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>CGP</div>
          {!collapsed && <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>CompressedGamesPC</div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>Admin Panel</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {NAV.map(section => (
            <div key={section.section}>
              {!collapsed && <div style={{ padding: '12px 16px 4px', fontSize: '10px', fontWeight: 700, color: '#475569', letterSpacing: '1px' }}>{section.section}</div>}
              {section.items.map(item => {
                const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: collapsed ? '10px 0' : '8px 12px', margin: '1px 8px', borderRadius: '8px', textDecoration: 'none', background: active ? 'rgba(99,102,241,.2)' : 'transparent', color: active ? '#818cf8' : '#94a3b8', justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all .15s' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && <span style={{ fontSize: '13px', fontWeight: active ? 600 : 400 }}>{item.label}</span>}
                    {!collapsed && (item as any).badge && <span style={{ marginLeft: 'auto', background: '#4f46e5', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '10px' }}>{(item as any).badge}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom user */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '12px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
              {user?.name?.[0] || 'A'}
            </div>
            {!collapsed && <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Admin'}</div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>{user?.role || 'super_admin'}</div>
            </div>}
            {!collapsed && <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '16px', padding: '4px' }} title="Logout">\u{1F6AA}</button>}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px', borderRadius: '6px', marginTop: '4px', fontSize: '12px' }}>
            {collapsed ? '\u25B6' : '\u25C0 Collapse'}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft: sideW, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left .2s', minWidth: 0 }}>
        
        {/* Top bar */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>\u{1F4CB}</div>
            <div style={{ color: '#64748b', fontSize: '13px' }}>
              {pathname.replace('/admin', '').replace(/\//, ' / ').replace(/^\s*\/\s*/, '') || 'Dashboard'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" target="_blank" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              \u{1F30D} View Site
            </Link>
            <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
            <span style={{ color: '#374151', fontSize: '13px', fontWeight: 500 }}>{user?.name || 'Admin'}</span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '24px', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  )
}