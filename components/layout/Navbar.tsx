import NavbarClient from './NavbarClient'
import { prisma } from '@/lib/prisma'

async function getSettings() {
  try {
    const s = await prisma.setting.findUnique({ where: { key: 'appearance' } })
    return s ? JSON.parse(s.value) : {}
  } catch { return {} }
}

export default async function Navbar() {
  const settings = await getSettings()
  return <NavbarClient initialSettings={settings} />
}