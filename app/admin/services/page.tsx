'use client'

import React, { useState, useEffect } from 'react'
import { getServices, addService, updateService, deleteService, Service } from '@/lib/api/services'
import { Plus, Pencil, Trash2, X, Code, MonitorSmartphone, ShoppingCart, LayoutDashboard } from 'lucide-react'

const IconMap: Record<string, React.ElementType> = {
  Code,
  MonitorSmartphone,
  ShoppingCart,
  LayoutDashboard
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('Code')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const data = await getServices()
    setServices(data)
    setLoading(false)
  }

  const openAddModal = () => {
    setEditingService(null)
    setTitle('')
    setDescription('')
    setIcon('Code')
    setIsModalOpen(true)
  }

  const openEditModal = (service: Service) => {
    setEditingService(service)
    setTitle(service.title)
    setDescription(service.description)
    setIcon(service.icon)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !icon) {
      alert('الرجاء ملء جميع الحقول')
      return
    }

    const serviceData = {
      title,
      description,
      icon
    }

    try {
      if (editingService) {
        await updateService(editingService.id, serviceData)
      } else {
        await addService(serviceData)
      }

      setIsModalOpen(false)
      fetchServices()
    } catch (error: any) {
      alert(`حدث خطأ أثناء الحفظ: ${error.message || 'يرجى المحاولة لاحقاً'}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      await deleteService(id)
      fetchServices()
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">إدارة الخدمات</h2>
          <p className="text-muted-foreground text-sm">أضف، عدل أو احذف الخدمات التقنية التي تقدمها.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold text-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة خدمة جديدة</span>
        </button>
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">جاري تحميل الخدمات...</div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d0d0e] border border-border/40 text-muted-foreground">
          لا يوجد أي خدمات مضافة حالياً. اضغط على إضافة خدمة للبدء.
        </div>
      ) : (
        <div className="bg-[#0d0d0e] border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-muted-foreground">
              <thead className="bg-card/45 text-foreground font-semibold border-b border-border/40">
                <tr>
                  <th className="px-6 py-4">أيقونة</th>
                  <th className="px-6 py-4">اسم الخدمة</th>
                  <th className="px-6 py-4">الوصف</th>
                  <th className="px-6 py-4 text-left">الخيارات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {services.map((service) => {
                  const IconComponent = IconMap[service.icon] || Code
                  return (
                    <tr key={service.id} className="hover:bg-card/25 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-9 h-9 rounded-lg bg-accent-blue/15 flex items-center justify-center">
                          <IconComponent className="w-4.5 h-4.5 text-accent-blue" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">{service.title}</td>
                      <td className="px-6 py-4 max-w-sm truncate">{service.description}</td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-card/50 rounded-lg transition-colors cursor-pointer"
                          title="تعديل"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0d0d0e] border border-border/40 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
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
                <label className="block text-xs font-semibold text-foreground mb-1.5">اسم الخدمة *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">الأيقونة *</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                >
                  <option value="Code">برمجة وتطوير (Code)</option>
                  <option value="MonitorSmartphone">واجهات مستخدم (MonitorSmartphone)</option>
                  <option value="ShoppingCart">متجر إلكتروني (ShoppingCart)</option>
                  <option value="LayoutDashboard">لوحة تحكم ونظم (LayoutDashboard)</option>
                </select>
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
