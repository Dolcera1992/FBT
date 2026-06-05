import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

const mapServiceRow = (row: any) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  iconName: row.icon_name,
})

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json((data || []).map(mapServiceRow))
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error fetching services' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase
      .from('services')
      .insert({
        title: body.title,
        description: body.description,
        icon_name: body.iconName,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(mapServiceRow(data))
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error adding service' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase
      .from('services')
      .update({
        title: body.title,
        description: body.description,
        icon_name: body.iconName,
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(mapServiceRow(data))
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error updating service' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })
      
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error deleting service' }, { status: 500 })
  }
}
