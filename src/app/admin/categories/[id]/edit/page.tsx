import { notFound } from 'next/navigation'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { prisma } from '@/lib/prisma'

interface EditCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id }
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Редагувати категорію</h1>
        <CategoryForm category={category} isEdit={true} />
      </div>
    </div>
  )
} 