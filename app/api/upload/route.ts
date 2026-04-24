import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    const folder = formData.get('folder') as string || 'games'
    const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, '-')}`
    const blob = await put(filename, file, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
