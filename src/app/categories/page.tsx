import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Категорії | Гайди по The Tower Defense Idle',
  description: 'Всі категорії гайдів по The Tower Defense Idle'
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      articles: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Категорії</h1>
        <p className="text-muted-foreground">
          Оберіть категорію, щоб знайти потрібні гайди
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className={`group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer ${
              index % 4 === 0 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' :
              index % 4 === 1 ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200' :
              index % 4 === 2 ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' :
              'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
            }`}>
              <CardHeader>
                <CardTitle className={`group-hover:scale-105 transition-transform ${
                  index % 4 === 0 ? 'text-blue-800' :
                  index % 4 === 1 ? 'text-purple-800' :
                  index % 4 === 2 ? 'text-green-800' :
                  'text-orange-800'
                }`}>
                  {category.name}
                </CardTitle>
                <CardDescription className={`font-medium ${
                  index % 4 === 0 ? 'text-blue-600' :
                  index % 4 === 1 ? 'text-purple-600' :
                  index % 4 === 2 ? 'text-green-600' :
                  'text-orange-600'
                }`}>
                  {category.articles.length} статей
                </CardDescription>
              </CardHeader>
              {category.articles.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700 mb-3">
                      Останні статті:
                    </h4>
                    <ul className="space-y-2">
                      {category.articles.map((article) => (
                        <li key={article.id}>
                          <span className="text-sm text-gray-700 hover:text-gray-900 transition-colors line-clamp-1">
                            {article.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Поки що немає категорій.</p>
        </div>
      )}
    </div>
  )
} 