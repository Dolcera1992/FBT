'use client'

import React, { useState, useEffect } from 'react'
import type { Project } from '@/lib/api/projects'
import { getProjects, addProject, updateProject, deleteProject } from '@/lib/api/projects'
import { Plus, Pencil, Trash2, X, AlertTriangle } from 'lucide-react'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error('Error fetching projects:', err)
      alert('حدث خطأ أثناء تحميل المشاريع')
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingProject(null)
    setTitle('')
    setDescription('')
    setImageUrl('')
    setLiveUrl('')
    setGithubUrl('')
    setTagsInput('')
    setIsModalOpen(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setTitle(project.title)
    setDescription(project.description)
    setImageUrl(project.imageUrl || '')
    setLiveUrl(project.liveUrl || '')
    setGithubUrl(project.githubUrl || '')
    setTagsInput(project.tags ? project.tags.join(', ') : '')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !imageUrl) {
      alert('الرجاء ملء الحقول الإجبارية')
      return
    }

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    const projectData = {
      title,
      description,
      imageUrl,
      liveUrl: liveUrl || undefined,
      githubUrl: githubUrl || undefined,
      tags
    }

    try {
      if (editingProject) {
        await updateProject({ id: editingProject.id, ...projectData } as Project)
      } else {
        await addProject(projectData)
      }

      setIsModalOpen(false)
      fetchProjects()
    } catch (error: any) {
      alert(`حدث خطأ أثناء الحفظ: ${error.message || 'يرجى المحاولة لاحقاً'}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      await deleteProject(id)
      fetchProjects()
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">إدارة المشاريع</h2>
          <p className="text-muted-foreground text-sm">أضف، عدل أو احذف مشاريع معرض الأعمال هنا.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold text-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مشروع جديد</span>
        </button>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">جاري تحميل المشاريع...</div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d0d0e] border border-border/40 text-muted-foreground">
          لا يوجد أي مشاريع مضافة حالياً. اضغط على إضافة مشروع للبدء.
        </div>
      ) : (
        <div className="bg-[#0d0d0e] border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-muted-foreground">
              <thead className="bg-card/45 text-foreground font-semibold border-b border-border/40">
                <tr>
                  <th className="px-6 py-4">اسم المشروع</th>
                  <th className="px-6 py-4">الوصف</th>
                  <th className="px-6 py-4">الوسوم</th>
                  <th className="px-6 py-4 text-left">الخيارات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-card/25 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{project.title}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{project.description}</td>
                    <td className="px-6 py-4">
                      {project.tags && project.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="inline-block bg-accent-purple/10 text-accent-purple px-2 py-0.5 rounded text-[10px] ml-1">
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-card/50 rounded-lg transition-colors cursor-pointer"
                        title="تعديل"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0d0d0e] border border-border/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'تعديل مشروع' : 'إضافة مشروع جديد'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-card cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">اسم المشروع *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">رابط صورة المعاينة *</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">الرابط المباشر للمشروع (Live URL)</label>
                  <input
                    type="text"
                    placeholder="https://live-site.com"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">رابط سورس كود Github</label>
                  <input
                    type="text"
                    placeholder="https://github.com/user/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">الوسوم (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  placeholder="Next.js, React, Supabase"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">الوصف *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-card text-foreground font-semibold text-sm hover:bg-card/80 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-accent-blue text-white font-semibold text-sm hover:bg-accent-blue/90 transition-colors cursor-pointer"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
