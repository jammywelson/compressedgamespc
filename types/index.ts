export interface Game {
  id: string
  title: string
  slug: string
  category: string
  size: string
  originalSize?: string
  status: string
  downloadCount: number
  rating?: number
  description?: string
  tags?: string[]
}
