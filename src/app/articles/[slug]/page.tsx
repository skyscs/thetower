import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    select: {
      slug: true
    }
  })

  return articles.map((article) => ({
    slug: article.slug
  }))
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true }
  })

  if (!article) {
    return {
      title: 'Стаття не знайдена'
    }
  }

  return {
    title: `${article.title} | Гайди по The Tower Defense Idle`,
    description: article.content.substring(0, 160)
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true }
  })

  if (!article) {
    notFound()
  }

  // Get related articles from the same category
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: { not: article.id }
    },
    take: 3,
    include: { category: true }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Головна</Link>
          {' / '}
          <Link href={`/categories/${article.category.id}`} className="hover:underline">
            {article.category.name}
          </Link>
          {' / '}
          <span>{article.title}</span>
        </nav>

        {/* Article */}
        <article className="mb-12">
          <header className="mb-8">
            <div className="mb-4">
              <Link 
                href={`/categories/${article.category.id}`}
                className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
              >
                {article.category.name}
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center text-muted-foreground text-sm">
              <span>Автор: {article.author}</span>
              <span className="mx-2">•</span>
              <time dateTime={article.createdAt.toISOString()}>
                {new Date(article.createdAt).toLocaleDateString('uk-UA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Схожі статті</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Link href={`/articles/${relatedArticle.slug}`} className="hover:underline">
                        {relatedArticle.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {relatedArticle.content.substring(0, 100)}...
                    </p>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/articles/${relatedArticle.slug}`}>
                          Читати далі
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
} 