'use client'

import React, { useState } from 'react'
import { UserData, createUser, updateUser, deleteUser } from '@/lib/api/users'
import { toast } from 'sonner'
import { Plus, Trash2, Edit, Shield, Mail, KeyRound, Loader2, User } from 'lucide-react'

export function UsersManager({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState<UserData[]>(initialUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    display_name: '',
    role: 'admin'
  })

  const openAddModal = () => {
    setModalMode('add')
    setFormData({ email: '', password: '', display_name: '', role: 'admin' })
    setIsModalOpen(true)
  }

  const openEditModal = (user: UserData) => {
    setModalMode('edit')
    setEditingUserId(user.id)
    setFormData({
      email: user.email,
      password: '', // Leave empty unless changing
      display_name: user.user_metadata?.display_name || '',
      role: user.user_metadata?.role || 'admin'
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟')) return

    const loadingToast = toast.loading('جاري حذف المستخدم...')
    const res = await deleteUser(id)
    
    if (res.success) {
      toast.success('تم حذف المستخدم بنجاح', { id: loadingToast })
      setUsers(users.filter(u => u.id !== id))
    } else {
      toast.error(res.error || 'فشل حذف المستخدم', { id: loadingToast })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    if (modalMode === 'add') {
      const res = await createUser(formData)
      if (res.success && res.user) {
        toast.success('تم إنشاء المستخدم بنجاح')
        setUsers([...users, {
          id: res.user.id,
          email: res.user.email || '',
          created_at: res.user.created_at,
          user_metadata: res.user.user_metadata
        }])
        setIsModalOpen(false)
      } else {
        toast.error(res.error || 'فشل إنشاء المستخدم')
      }
    } else {
      if (!editingUserId) return
      const res = await updateUser(editingUserId, formData)
      if (res.success && res.user) {
        toast.success('تم تحديث المستخدم بنجاح')
        setUsers(users.map(u => u.id === editingUserId ? {
          ...u,
          email: formData.email,
          user_metadata: {
            ...u.user_metadata,
            display_name: formData.display_name,
            role: formData.role
          }
        } : u))
        setIsModalOpen(false)
      } else {
        toast.error(res.error || 'فشل تحديث المستخدم')
      }
    }
    
    setIsSubmitting(false)
  }

  return (
    <div>
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent-blue" />
          المسؤولون في النظام
        </h2>
        <button 
          onClick={openAddModal}
          className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          إضافة مستخدم
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#121214] border border-border/40 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#18181b] border-b border-border/40 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">الاسم</th>
                <th className="px-6 py-4 font-semibold">البريد الإلكتروني</th>
                <th className="px-6 py-4 font-semibold">تاريخ الإضافة</th>
                <th className="px-6 py-4 font-semibold">الدور</th>
                <th className="px-6 py-4 font-semibold text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple font-bold">
                        {user.user_metadata?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-semibold">{user.user_metadata?.display_name || 'بدون اسم'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300" dir="ltr">{user.email}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-accent-blue/10 text-accent-blue px-2.5 py-1 rounded-full text-xs font-semibold">
                      {user.user_metadata?.role === 'admin' ? 'مدير نظام' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    لا يوجد مستخدمين لعرضهم
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#121214] border border-border/40 rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border/40 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {modalMode === 'add' ? 'إضافة مستخدم جديد' : 'تعديل بيانات المستخدم'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-accent-purple" />
                  الاسم الكامل
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.display_name}
                  onChange={e => setFormData({...formData, display_name: e.target.value})}
                  className="w-full bg-black/40 border border-border/50 rounded-lg px-4 py-2.5 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple outline-none transition-all"
                  placeholder="محمد أحمد"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent-blue" />
                  البريد الإلكتروني
                </label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-border/50 rounded-lg px-4 py-2.5 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue outline-none transition-all text-left"
                  dir="ltr"
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-accent-emerald" />
                  كلمة المرور
                  {modalMode === 'edit' && <span className="text-xs text-gray-500 font-normal">(اتركه فارغاً إذا لم ترغب بتغييره)</span>}
                </label>
                <input 
                  type="password" 
                  required={modalMode === 'add'}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/40 border border-border/50 rounded-lg px-4 py-2.5 focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald outline-none transition-all text-left"
                  dir="ltr"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-l from-accent-purple to-accent-blue text-white py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalMode === 'add' ? 'إضافة المستخدم' : 'حفظ التعديلات'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-colors"
                >
                  إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}
