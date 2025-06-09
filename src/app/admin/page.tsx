import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [articlesCount, categoriesCount, recentArticles] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    })
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Адміністративна панель</h1>
        <LogoutButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Статті</CardTitle>
            <CardDescription>Загальна кількість статей</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{articlesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Категорії</CardTitle>
            <CardDescription>Загальна кількість категорій</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categoriesCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Управління статтями</CardTitle>
            <CardDescription>Створення та редагування статей</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/admin/articles/new">Створити нову статтю</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/articles">Переглянути всі статті</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Управління категоріями</CardTitle>
            <CardDescription>Створення та редагування категорій</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/admin/categories/new">Створити нову категорію</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/categories">Переглянути всі категорії</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Останні статті</CardTitle>
          <CardDescription>Нещодавно створені статті</CardDescription>
        </CardHeader>
        <CardContent>
          {recentArticles.length > 0 ? (
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {article.category.name} • {article.author} • {new Date(article.createdAt).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/articles/${article.slug}`}>Переглянути</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/articles/${article.id}/edit`}>Редагувати</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Поки що немає статей.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <Button type="submit" variant="outline">
        Вийти
      </Button>
    </form>
  )
} 