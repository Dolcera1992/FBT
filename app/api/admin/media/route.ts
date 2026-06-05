import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const mappedData = (data || []).map(row => ({
      id: row.id,
      name: row.name,
      url: row.url,
      fileType: row.file_type,
      size: row.size,
      storagePath: row.storage_path,
      createdAt: row.created_at,
    }))

    return NextResponse.json(mappedData)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    
    // Check if duplicate name exists
    const { data: existing } = await supabase
      .from('media')
      .select('name')
      .eq('name', file.name)
      .single()
      
    let fileName = file.name
    if (existing) {
      const ext = fileName.split('.').pop()
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'))
      fileName = `${nameWithoutExt}-${Date.now()}.${ext}`
    }
    
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload to Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('portfolio-media')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })
      
    if (storageError) {
      return NextResponse.json({ error: 'فشل رفع الملف إلى التخزين: ' + storageError.message }, { status: 500 })
    }
    
    // Get Public URL
    const { data: urlData } = supabase.storage
      .from('portfolio-media')
      .getPublicUrl(fileName)
      
    const publicUrl = urlData.publicUrl
    
    // Save to Database
    const { data: dbData, error: dbError } = await supabase
      .from('media')
      .insert({
        name: file.name, // Original name
        url: publicUrl,
        file_type: file.type,
        size: file.size,
        storage_path: fileName // actual storage name
      })
      .select()
      .single()
      
    if (dbError) {
      // Revert upload if DB fails
      await supabase.storage.from('portfolio-media').remove([fileName])
      return NextResponse.json({ error: 'فشل حفظ بيانات الملف: ' + dbError.message }, { status: 500 })
    }
    
    return NextResponse.json({
      id: dbData.id,
      name: dbData.name,
      url: dbData.url,
      fileType: dbData.file_type,
      size: dbData.size,
      storagePath: dbData.storage_path,
      createdAt: dbData.created_at,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error uploading' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const storagePath = searchParams.get('storagePath')
    
    if (!id || !storagePath) {
      return NextResponse.json({ error: 'معرف الملف ومسار التخزين مطلوبان' }, { status: 400 })
    }
    
    const supabase = getSupabaseAdmin()
    
    // 1. Delete from database
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)
      
    if (dbError) {
      return NextResponse.json({ error: 'فشل حذف الملف من قاعدة البيانات: ' + dbError.message }, { status: 500 })
    }
    
    // 2. Delete from storage
    const { error: storageError } = await supabase.storage
      .from('portfolio-media')
      .remove([storagePath])
      
    if (storageError) {
      return NextResponse.json({ error: 'فشل حذف الملف من التخزين السحابي: ' + storageError.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error deleting' }, { status: 500 })
  }
}
