import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const mappedUsers = users?.users.map(user => ({
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      user_metadata: user.user_metadata
    })) || []

    return NextResponse.json({ users: mappedUsers })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error fetching users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password || 'Temporary123!',
      email_confirm: true,
      user_metadata: {
        display_name: body.display_name,
        role: body.role || 'admin'
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        user_metadata: data.user.user_metadata
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error adding user' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()
    
    const updateData: any = {}
    if (body.email) updateData.email = body.email
    if (body.password) updateData.password = body.password
    
    if (body.display_name !== undefined || body.role !== undefined) {
      updateData.user_metadata = {}
      if (body.display_name !== undefined) updateData.user_metadata.display_name = body.display_name
      if (body.role !== undefined) updateData.user_metadata.role = body.role
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      body.id,
      updateData
    )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ user: data.user })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error updating user' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })
      
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.auth.admin.deleteUser(id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error deleting user' }, { status: 500 })
  }
}
