import { getUsers } from '@/lib/api/users'
import { UsersManager } from './UsersManager'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function UsersPage() {
  const { users, error } = await getUsers()

  return (
    <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">إدارة المستخدمين</h1>
        <p className="text-muted-foreground">أضف، عدل، واحذف صلاحيات الدخول للنظام بكل أمان وسهولة.</p>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          حدث خطأ أثناء جلب المستخدمين: {error}
        </div>
      ) : (
        <UsersManager initialUsers={users} />
      )}
    </main>
  )
}
