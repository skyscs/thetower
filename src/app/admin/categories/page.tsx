// Предотвращаем статическое пререндеринг этой страницы
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { DeleteCategoryButton } from '@/components/admin/DeleteCategoryButton'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      articles: true
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Категорії</h1>
        <Button asChild>
          <Link href="/admin/categories/new">Створити категорію</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                {category.articles.length} статей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/categories/${category.id}/edit`}>Редагувати</Link>
                </Button>
                <DeleteCategoryButton 
                  categoryId={category.id} 
                  categoryName={category.name}
                  articlesCount={category.articles.length}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Ще немає категорій</p>
          <Button asChild>
            <Link href="/admin/categories/new">Створити першу категорію</Link>
          </Button>
        </div>
      )}
    </div>
  )
} 