// Предотвращаем статическое пререндеринг этой страницы
export const dynamic = 'force-dynamic'

import { ArticleForm } from '@/components/admin/ArticleForm'
import { prisma } from '@/lib/prisma'

export default async function NewArticlePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Створити нову статтю</h1>
        <ArticleForm categories={categories} />
      </div>
    </div>
  )
} 