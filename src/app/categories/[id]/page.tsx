import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

interface CategoryPageProps {
  params: Promise<{
    id: string
  }>
}

// Enable SSG
export const dynamic = 'force-static'
export const revalidate = false // Use ISR only with revalidatePath

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true
      }
    })

    return categories.map((category) => ({
      id: category.id
    }))
  } catch (_) {
    // Fallback if database is not available during build
    console.warn('Database not available during build, using empty static params')
    return []
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id }
  })

  if (!category) {
    return {
      title: 'Категорія не знайдена'
    }
  }

  return {
    title: `${category.name} | Гайди по The Tower Defense Idle`,
    description: `Всі статті в категорії ${category.name}`
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      articles: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Головна</Link>
          {' / '}
          <Link href="/categories" className="hover:underline">Категорії</Link>
          {' / '}
          <span>{category.name}</span>
        </nav>
        
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        <p className="text-muted-foreground">
          {category.articles.length} статей в цій категорії
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.articles.map((article, index) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <Card className={`group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 ${
              index % 3 === 0 ? 'border-l-blue-500 hover:border-l-blue-600' :
              index % 3 === 1 ? 'border-l-purple-500 hover:border-l-purple-600' :
              'border-l-green-500 hover:border-l-green-600'
            }`}>
              <CardHeader>
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

      {category.articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">В цій категорії поки що немає статей.</p>
        </div>
      )}
    </div>
  )
} 