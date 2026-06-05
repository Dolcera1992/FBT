'use server'

import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  fileType: string;
  size: number;
  storagePath: string;
  createdAt: string;
}

// Config constants
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 20;

/**
 * Validates a file type and size before upload
 */
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      isValid: false,
      error: 'نوع الملف غير مدعوم. يرجى رفع صور (PNG, JPG, WEBP, SVG) أو فيديوهات (MP4, WEBM).',
    };
  }

  const fileSizeMB = file.size / (1024 * 1024);

  if (isImage && fileSizeMB > MAX_IMAGE_SIZE_MB) {
    return {
      isValid: false,
      error: `حجم الصورة كبير جداً. الحد الأقصى هو ${MAX_IMAGE_SIZE_MB} ميجابايت.`,
    };
  }

  if (isVideo && fileSizeMB > MAX_VIDEO_SIZE_MB) {
    return {
      isValid: false,
      error: `حجم الفيديو كبير جداً. الحد الأقصى هو ${MAX_VIDEO_SIZE_MB} ميجابايت.`,
    };
  }

  return { isValid: true };
};

const mapMediaRow = (row: any): MediaItem => ({
  id: row.id,
  name: row.name,
  url: row.url,
  fileType: row.file_type,
  size: row.size,
  storagePath: row.storage_path,
  createdAt: row.created_at,
})

/**
 * Fetches all media items from the database
 */
export const getMedia = async (): Promise<MediaItem[]> => {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching media:', error)
      return []
    }

    return (data || []).map(mapMediaRow)
  } catch (err: any) {
    console.error('Fatal error in getMedia:', err)
    throw new Error('فشل الاتصال بقاعدة البيانات. تأكد من إعداد متغيرات البيئة.')
  }
}

/**
 * Uploads media to Supabase Storage and inserts metadata into DB
 */
export const uploadMedia = async (formData: FormData): Promise<MediaItem> => {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('لا يوجد ملف للرفع');

    // 1. Validation
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error || 'ملف غير صالح');
    }

    // 2. Generate unique filename and path
    const fileExt = file.name.split('.').pop() || '';
    const cleanName = file.name.replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${cleanName}`;
    const filePath = `uploads/${fileName}`;

    const supabase = getSupabaseAdmin()

    // 3. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase Storage Upload Error:', uploadError.message);
      throw new Error(`فشل رفع الملف إلى التخزين: ${uploadError.message}`);
    }

    // 4. Get Public URL
    const { data: urlData } = supabase.storage
      .from('portfolio-media')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl;

    // 5. Save metadata to Database
    const { data: dbData, error: dbError } = await supabase
      .from('media')
      .insert({
        name: file.name,
        url: publicUrl,
        file_type: file.type,
        size: file.size,
        storage_path: filePath
      })
      .select()
      .single()

    if (dbError) {
      console.error('Supabase DB Insert Error:', dbError.message);
      // Cleanup storage file on database failure
      await supabase.storage.from('portfolio-media').remove([filePath])
      throw new Error(`فشل حفظ بيانات الملف في قاعدة البيانات: ${dbError.message}`);
    }

    return mapMediaRow(dbData)
  } catch (err: any) {
    console.error('Fatal error in uploadMedia:', err)
    throw new Error(err.message || 'فشل رفع الملف لسبب غير معروف.')
  }
}

/**
 * Deletes media from both storage and database
 */
export const deleteMedia = async (id: string, storagePath: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseAdmin()
    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from('portfolio-media')
      .remove([storagePath])

    if (storageError) {
      console.error('Supabase Storage Deletion Error:', storageError.message);
      // Continue deleting from DB even if file in storage is missing to prevent ghost DB records
    }

    // 2. Delete from DB
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)

    if (dbError) {
      console.error('Supabase DB Deletion Error:', dbError.message);
      throw new Error(`فشل حذف الملف من قاعدة البيانات: ${dbError.message}`);
    }

    return true
  } catch (err: any) {
    console.error('Fatal error in deleteMedia:', err)
    throw new Error(err.message || 'فشل حذف الملف لسبب غير معروف.')
  }
}
