import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

const mapProjectRow = (row: any) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  tags: row.tags || [],
  imageUrl: row.image_url,
  liveUrl: row.live_url,
  githubUrl: row.github_url,
})

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json((data || []).map(mapProjectRow))
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error fetching projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: body.title,
        description: body.description,
        tags: body.tags,
        image_url: body.imageUrl,
        live_url: body.liveUrl,
        github_url: body.githubUrl,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(mapProjectRow(data))
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error adding project' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: body.title,
        description: body.description,
        tags: body.tags,
        image_url: body.imageUrl,
        live_url: body.liveUrl,
        github_url: body.githubUrl,
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(mapProjectRow(data))
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error updating project' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })
      
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error deleting project' }, { status: 500 })
  }
}
