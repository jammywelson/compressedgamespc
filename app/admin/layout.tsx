'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { href: '/admin', icon: '\u{1F4CA}', label: 'Dashboard', exact: true },
    ]
  },
  {
    title: 'CONTENT',
    items: [
      { href: '/admin/games', icon: '\u{1F3AE}', label: 'Games' },
      { href: '/admin/games/add', icon: '\u{2795}', label: 'Add Game' },
      { href: '/admin/categories', icon: '\u{1F4C1}', label: 'Categories' },
      { href: '/admin/comments', icon: '\u{1F4AC}', label: 'Comments' },
      { href: '/admin/media', icon: '\u{1F5BC}\uFE0F', label: 'Media Library' },
    ]
  },
  {
    title: 'CUSTOMIZE',
    items: [
      { href: '/admin/homepage', icon: '\u{1F3E0}', label: 'Homepage' },
      { href: '/admin/appearance', icon: '\u{1F3A8}', label: 'Appearance' },
      { href: '/admin/menus', icon: '\u{1F4CB}', label: 'Menus' },
    ]
  },
  {
    title: 'SITE',
    items: [
      { href: '/admin/seo', icon: '\u{1F50D}', label: 'SEO Settings' },
      { href: '/admin/ads', icon: '\u{1F4B0}', label: 'Ads Manager' },
      { href: '/admin/settings', icon: '\u{2699}\uFE0F', label: 'Site Settings' },
    ]
  },
  {
    title: 'USERS',
    items: [
      { href: '/admin/users', icon: '\u{1F465}', label: 'Users' },
      { href: '/admin/roles', icon: '\u{1F512}', label: 'Roles & Permissions' },
    ]
  },
  {
    title: 'TOOLS',
    items: [
      { href: '/admin/analytics', icon: '\u{1F4C8}', label: 'Analytics' },
      { href: '/admin/security', icon: '\u{1F6E1}\uFE0F', label: 'Security' },
      { href: '/admin/backup', icon: '\u{1F4BE}', label: 'Backup & Restore' },
    ]
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') return
    fetch('/api/admin/me').then(r => r.json()).then(d => {
      if (!d?.id) router.push('/admin/login')
      else setUser(d)
    }).catch(() => router.push('/admin/login'))
  }, [pathname])

  useEffect(() => {
    const saved = localStorage.getItem('admin_dark')
    if (saved === 'true') setDark(true)
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('admin_dark', String(next))
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const bg = dark ? '#0f172a' : '#ffffff'
  const sidebarBg = dark ? '#1e293b' : '#1e293b'
  const mainBg = dark ? '#0f172a' : '#f8fafc'
  const headerBg = dark ? '#1e293b' : '#ffffff'
  const textColor = dark ? '#f1f5f9' : '#1e293b'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', background: mainBg }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 40 }} />
      )}

      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? '64px' : '240px',
        background: sidebarBg,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: mobileOpen ? 0 : undefined,
        height: '100vh', zIndex: 50,
        transition: 'width .2s ease',
        boxShadow: '2px 0 8px rgba(0,0,0,.15)',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '16px 12px', borderBottom: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>C</div>
          {!collapsed && <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', lineHeight: 1.2 }}>CGP Admin</div>
            <div style={{ color: '#94a3b8', fontSize: '11px' }}>{user?.role || 'Admin'}</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.title}>
              {!collapsed && <div style={{ padding: '12px 16px 4px', fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '1px' }}>{section.title}</div>}
              {section.items.map(item => {
                const active = isActive(item.href, item.exact)
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: collapsed ? '10px 14px' : '9px 16px',
                      margin: '1px 8px', borderRadius: '8px',
                      background: active ? 'rgba(99,102,241,.2)' : 'transparent',
                      color: active ? '#818cf8' : '#94a3b8',
                      textDecoration: 'none', fontSize: '13px', fontWeight: active ? 600 : 400,
                      transition: 'all .15s', whiteSpace: 'nowrap',
                    }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                    {active && !collapsed && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <button onClick={toggleDark} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', marginBottom: '4px' }}>
            <span>{dark ? '\u2600\uFE0F' : '\u{1F319}'}</span>
            {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>
            <span style={{ fontSize: '16px' }}>{collapsed ? '\u{1F4CC}' : '\u25C4'}</span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: collapsed ? '64px' : '240px', flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin .2s ease', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{ background: headerBg, borderBottom: '1px solid ' + (dark ? '#1e293b' : '#e2e8f0'), padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', display: 'none' }}>\u2630</button>
            <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: dark ? '#94a3b8' : '#64748b', textDecoration: 'none', fontSize: '13px' }}>
              <span>\u{1F310}</span> View Site
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: dark ? '#94a3b8' : '#64748b' }}>{user?.username || 'Admin'}</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }} onClick={logout}>
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px', color: textColor }}>
          {children}
        </main>
      </div>
    </div>
  )
}