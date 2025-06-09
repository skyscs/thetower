import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { DeleteArticleButton } from '@/components/admin/DeleteArticleButton'

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Управління статтями</h1>
          <p className="text-muted-foreground">Всього статей: {articles.length}</p>
        </div>
        <div className="space-x-2">
          <Button asChild>
            <Link href="/admin/articles/new">Створити статтю</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Назад до панелі</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="mb-2">{article.title}</CardTitle>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Категорія: {article.category.name}</p>
                    <p>Автор: {article.author}</p>
                    <p>Створено: {new Date(article.createdAt).toLocaleDateString('uk-UA')}</p>
                    <p>Slug: {article.slug}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/articles/${article.slug}`}>Переглянути</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/articles/${article.id}/edit`}>Редагувати</Link>
                  </Button>
                  <DeleteArticleButton articleId={article.id} articleTitle={article.title} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {article.content.substring(0, 200)}...
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Поки що немає статей.</p>
          <Button asChild>
            <Link href="/admin/articles/new">Створити першу статтю</Link>
          </Button>
        </div>
      )}
    </div>
  )
} 