
import { UsersManager } from './UsersManager'

export const dynamic = 'force-dynamic'

export default function UsersPage() {
  return (
    <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">إدارة المستخدمين</h1>
        <p className="text-muted-foreground">أضف، عدل، واحذف صلاحيات الدخول للنظام بكل أمان وسهولة.</p>
      </div>

      <UsersManager />
    </main>
  )
}
