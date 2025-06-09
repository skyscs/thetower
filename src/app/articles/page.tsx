import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

// Enable SSG
export const dynamic = 'force-static'
export const revalidate = false // Use ISR only with revalidatePath

export const metadata = {
  title: 'Всі статті | Гайди по The Tower Defense Idle',
  description: 'Повний список всіх гайдів та статей по The Tower Defense Idle'
}

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Всі статті</h1>
        <p className="text-muted-foreground">
          Знайдіть всі наші гайди та поради по The Tower Defense Idle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <Card className={`group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 ${
              index % 3 === 0 ? 'border-l-blue-500 hover:border-l-blue-600' :
              index % 3 === 1 ? 'border-l-purple-500 hover:border-l-purple-600' :
              'border-l-green-500 hover:border-l-green-600'
            }`}>
              <CardHeader>
                <div className={`text-sm font-medium mb-2 px-2 py-1 rounded-full w-fit ${
                  index % 3 === 0 ? 'bg-blue-100 text-blue-800' :
                  index % 3 === 1 ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {article.category.name}
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="text-orange-600 font-medium">{article.author}</span>
                  <span>•</span>
                  <span>{new Date(article.createdAt).toLocaleDateString('uk-UA')}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {article.content.substring(0, 150)}...
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Поки що немає статей.</p>
        </div>
      )}
    </div>
  )
} 