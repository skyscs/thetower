'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createSlug } from '@/lib/slug'

interface Category {
  id: string
  name: string
}

interface Article {
  id?: string
  title: string
  content: string
  author: string
  categoryId: string
  slug?: string
}

interface ArticleFormProps {
  categories: Category[]
  article?: Article
  isEdit?: boolean
}

export function ArticleForm({ categories, article, isEdit = false }: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    author: article?.author || '',
    categoryId: article?.categoryId || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const slug = createSlug(formData.title)
      const url = isEdit ? `/api/admin/articles/${article?.id}` : '/api/admin/articles'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug
        }),
      })

      if (response.ok) {
        router.push('/admin/articles')
      } else {
        const data = await response.json()
        setError(data.error || 'Помилка при збереженні статті')
      }
    } catch (_) {
      setError('Помилка при збереженні статті')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Редагувати статтю' : 'Створити нову статтю'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              disabled={loading}
            />
            {formData.title && (
              <p className="text-sm text-muted-foreground mt-1">
                URL: /articles/{createSlug(formData.title)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="author">Автор</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="category">Категорія</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleInputChange('categoryId', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Оберіть категорію" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">Зміст статті</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              required
              disabled={loading}
              rows={15}
              placeholder="Введіть зміст статті..."
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Збереження...' : (isEdit ? 'Оновити статтю' : 'Створити статтю')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/articles')}
              disabled={loading}
            >
              Скасувати
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 