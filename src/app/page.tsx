import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: {
      articles: {
        take: 3,
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  const recentArticles = await prisma.article.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Banner */}
        <div className="lg:col-span-3 text-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 py-12 px-6 rounded-3xl shadow-lg">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.webp"
              alt="The Tower Defense Idle Logo"
              width={120}
              height={120}
              className="rounded-2xl shadow-2xl hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Гайди по The Tower Defense Idle
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Повний збірник стратегій, порад та гайдів для успішної гри. 
            Дізнайтесь секрети майстерності та станьте експертом у The Tower Defense Idle!
          </p>
        </div>

        {/* Telegram Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white rounded-2xl p-6 shadow-lg">
          <div className="mb-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Image
                src="/telegram.png"
                alt="Telegram"
                width={32}
                height={32}
              />
              <h3 className="text-lg font-bold text-white">
                Долучайтеся до української спільноти гри у Телеграм!
              </h3>
            </div>
          </div>
          
          <Link 
            href="https://t.me/thetowerua" 
            target="_blank"
            rel="noopener noreferrer"
            className="block group hover:scale-105 transition-transform duration-300"
          >
            <div className="mb-3">
              <Image
                src="/tgqr.jpg"
                alt="QR код для Telegram групи TheTowerUA"
                width={140}
                height={140}
                className="mx-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
              />
            </div>
            <div className="bg-white text-purple-600 hover:bg-yellow-300 hover:text-purple-800 py-2 px-4 rounded-lg font-medium transition-colors">
              @TheTowerUA
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Articles */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-black">
          Останні статті
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article, index) => (
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
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-black">
          Категорії
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className={`group hover:shadow-lg hover:scale-102 transition-all duration-300 cursor-pointer ${
                index % 4 === 0 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' :
                index % 4 === 1 ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200' :
                index % 4 === 2 ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' :
                'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
              }`}>
                <CardHeader>
                  <CardTitle className={`group-hover:scale-101 transition-transform ${
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
                    <ul className="space-y-2">
                      {category.articles.map((article) => (
                        <li key={article.id}>
                          <span className="text-sm text-gray-700 hover:text-gray-900 transition-colors line-clamp-1">
                            {article.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
