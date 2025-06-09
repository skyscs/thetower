import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { DeleteCategoryButton } from '@/components/admin/DeleteCategoryButton'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { articles: true }
      }
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Управління категоріями</h1>
          <p className="text-muted-foreground">Всього категорій: {categories.length}</p>
        </div>
        <div className="space-x-2">
          <Button asChild>
            <Link href="/admin/categories/new">Створити категорію</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Назад до панелі</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{category.name}</span>
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/categories/${category.id}/edit`}>Редагувати</Link>
                  </Button>
                  <DeleteCategoryButton 
                    categoryId={category.id} 
                    categoryName={category.name}
                    articlesCount={category._count.articles}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Статей: {category._count.articles}
                </p>
                <p className="text-sm text-muted-foreground">
                  Створено: {new Date(category.createdAt).toLocaleDateString('uk-UA')}
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/categories/${category.id}`}>Переглянути категорію</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Поки що немає категорій.</p>
          <Button asChild>
            <Link href="/admin/categories/new">Створити першу категорію</Link>
          </Button>
        </div>
      )}
    </div>
  )
} 