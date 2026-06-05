'use client'

export const runtime = 'edge'

import React, { useState, useEffect, useRef } from 'react'
import type { MediaItem } from '@/lib/api/media'
import { getMedia, uploadMedia, deleteMedia } from '@/lib/api/media'
import { 
  UploadCloud, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Loader2, 
  Search, 
  Eye, 
  X 
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Preview Modal
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const items = await getMedia()
      setMediaItems(items)
    } catch (err: any) {
      toast.error('حدث خطأ أثناء جلب الملفات: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  // Handle Drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      await processUpload(file)
    }
  }

  // Handle File Input Change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      await processUpload(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Core Upload Process
  const processUpload = async (file: File) => {
    setUploading(true)
    setUploadProgress(20) // Initial simulated progress
    const toastId = toast.loading(`جاري رفع الملف "${file.name}"...`)

    try {
      setUploadProgress(50)
      const formData = new FormData()
      formData.append('file', file)
      const newItem = await uploadMedia(formData)
      setUploadProgress(90)
      
      setMediaItems(prev => [newItem, ...prev])
      setUploadProgress(100)
      toast.success(`تم رفع الملف "${file.name}" بنجاح!`, { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'فشل رفع الملف', { id: toastId })
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Copy Link to Clipboard
  const handleCopyLink = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url)
      setCopiedId(item.id)
      toast.success('تم نسخ رابط الملف إلى الحافظة!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast.error('فشل نسخ الرابط.')
    }
  }

  // Delete Media Item
  const handleDeleteItem = async (item: MediaItem) => {
    if (!confirm(`هل أنت متأكد من حذف الملف "${item.name}" نهائياً من قاعدة البيانات والتخزين؟`)) {
      return
    }

    const toastId = toast.loading('جاري حذف الملف...')
    try {
      await deleteMedia(item.id, item.storagePath)
      setMediaItems(prev => prev.filter(i => i.id !== item.id))
      toast.success('تم حذف الملف بنجاح!', { id: toastId })
      if (previewItem?.id === item.id) {
        setPreviewItem(null)
      }
    } catch (err: any) {
      toast.error(err.message || 'فشل حذف الملف', { id: toastId })
    }
  }

  // Format File Size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format Date in Arabic
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter Items by Search Query
  const filteredItems = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isImage = (type: string) => type.startsWith('image/')
  const isVideo = (type: string) => type.startsWith('video/')

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">مكتبة الوسائط</h2>
        <p className="text-muted-foreground text-sm">
          ارفع صور ومقاطع فيديو مشروعك واحصل على روابط مباشرة لاستخدامها في المعرض.
        </p>
      </div>

      {/* Upload Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
          isDragActive 
            ? 'border-accent-blue bg-accent-blue/10 scale-[0.99] shadow-inner' 
            : 'border-border/60 bg-[#0d0d0e] hover:border-accent-blue/45 hover:bg-card/20'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*,video/*"
        />
        
        {uploading ? (
          <div className="space-y-4 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-accent-blue animate-spin" />
            <div className="text-sm font-semibold text-white">جاري رفع الملف...</div>
            <div className="w-64 bg-card rounded-full h-2 overflow-hidden border border-border">
              <div 
                className="bg-accent-blue h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-accent-blue/15 flex items-center justify-center text-accent-blue transform transition-transform group-hover:scale-110">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-white mb-1">
                اسحب الملف وأفلته هنا، أو اضغط للتصفح
              </p>
              <p className="text-xs text-muted-foreground">
                يدعم الصور (PNG, JPG, WEBP, SVG حتى 5MB) والفيديوهات (MP4, WEBM حتى 20MB)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Control Bar: Search & Count */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d0d0e] p-4 rounded-2xl border border-border/40">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن ملف باسمه..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          />
        </div>
        <div className="text-xs text-muted-foreground font-semibold">
          إجمالي الملفات: {filteredItems.length} من أصل {mediaItems.length}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        // Skeleton Loaders
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#0d0d0e] border border-border/40 rounded-2xl p-3 space-y-3 animate-pulse">
              <div className="aspect-video bg-card rounded-xl" />
              <div className="h-4 bg-card rounded w-3/4 mx-auto" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-3 bg-card rounded w-1/4" />
                <div className="h-8 bg-card rounded-lg w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#0d0d0e] border border-border/40 text-muted-foreground">
          {searchQuery ? 'لا توجد نتائج مطابقة لبحثك.' : 'لا يوجد ملفات مرفوعة حالياً. ابدأ برفع أول ملف.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-[#0d0d0e] border border-border/40 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-md hover:border-accent-blue/35 transition-all duration-300"
            >
              {/* Preview Container */}
              <div className="relative aspect-video rounded-xl bg-black overflow-hidden flex items-center justify-center border border-border/20">
                {isImage(item.fileType) ? (
                  <img 
                    src={item.url} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : isVideo(item.fileType) ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover muted" 
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <VideoIcon className="w-8 h-8 text-white/90 drop-shadow" />
                    </div>
                  </div>
                ) : (
                  <FileText className="w-12 h-12 text-muted-foreground" />
                )}

                {/* Overlays actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-2 bg-card hover:bg-white/10 text-white rounded-lg transition-colors cursor-pointer"
                    title="معاينة"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyLink(item)}
                    className="p-2 bg-card hover:bg-white/10 text-white rounded-lg transition-colors cursor-pointer"
                    title="نسخ الرابط"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="p-2 bg-card hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info Block */}
              <div className="mt-3 space-y-1.5 flex-1 flex flex-col justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white truncate max-w-full" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                    <span>{formatSize(item.size)}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-1.5">
                  <button
                    onClick={() => handleCopyLink(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-card text-[11px] font-semibold text-white border border-border/40 hover:bg-card/75 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Modal Overlay */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-[#0d0d0e] border border-border/40 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
              <h3 className="text-base font-bold text-white truncate max-w-lg" title={previewItem.name}>
                معاينة: {previewItem.name}
              </h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-card cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col items-center justify-center bg-black/20 min-h-[300px] max-h-[70vh]">
              {isImage(previewItem.fileType) ? (
                <img 
                  src={previewItem.url} 
                  alt={previewItem.name}
                  className="max-h-[50vh] max-w-full object-contain rounded-xl"
                />
              ) : isVideo(previewItem.fileType) ? (
                <video 
                  src={previewItem.url} 
                  controls 
                  className="max-h-[50vh] max-w-full rounded-xl"
                  autoPlay
                />
              ) : (
                <div className="text-center space-y-4">
                  <FileText className="w-20 h-20 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">الملف غير قابل للمعاينة المباشرة.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border/40 bg-[#0d0d0e]/60 flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <div className="flex gap-4">
                <span>الحجم: {formatSize(previewItem.size)}</span>
                <span>النوع: {previewItem.fileType}</span>
                <span>تاريخ الرفع: {formatDate(previewItem.createdAt)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyLink(previewItem)}
                  className="px-4 py-2 rounded-xl bg-accent-blue text-white font-bold hover:bg-accent-blue/90 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ رابط الملف</span>
                </button>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 rounded-xl bg-card text-foreground font-bold hover:bg-card/80 transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
