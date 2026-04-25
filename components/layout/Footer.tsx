import FooterClient from './FooterClient'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export const revalidate = 0
async function getSettings() {
  try {
    const s = await prisma.setting.findUnique({ where: { key: 'appearance' } })
    return s ? JSON.parse(s.value) : {}
  } catch { return {} }
}
export default async function Footer() {
  const settings = await getSettings()
  return <FooterClient initialSettings={settings} />
}