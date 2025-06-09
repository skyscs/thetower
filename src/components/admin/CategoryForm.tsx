'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Category {
  id?: string
  name: string
}

interface CategoryFormProps {
  category?: Category
  isEdit?: boolean
}

export function CategoryForm({ category, isEdit = false }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEdit ? `/api/admin/categories/${category?.id}` : '/api/admin/categories'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        router.push('/admin/categories')
      } else {
        const data = await response.json()
        setError(data.error || 'Помилка при збереженні категорії')
      }
    } catch (_) {
      setError('Помилка при збереженні категорії')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Редагувати категорію' : 'Створити нову категорію'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Назва категорії</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              placeholder="Введіть назву категорії..."
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Збереження...' : (isEdit ? 'Оновити категорію' : 'Створити категорію')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/categories')}
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