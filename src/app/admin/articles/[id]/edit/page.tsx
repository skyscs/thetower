import { notFound } from 'next/navigation'
import { ArticleForm } from '@/components/admin/ArticleForm'
import { prisma } from '@/lib/prisma'

interface EditArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!article) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Редагувати статтю</h1>
        <ArticleForm categories={categories} article={article} isEdit={true} />
      </div>
    </div>
  )
} 