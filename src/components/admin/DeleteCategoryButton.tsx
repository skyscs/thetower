'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface DeleteCategoryButtonProps {
  categoryId: string
  categoryName: string
  articlesCount: number
}

export function DeleteCategoryButton({ categoryId, categoryName, articlesCount }: DeleteCategoryButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (articlesCount > 0) {
      alert(`Неможливо видалити категорію "${categoryName}", оскільки в ній є ${articlesCount} статей. Спочатку видаліть або перенесіть всі статті.`)
      return
    }

    if (!confirm(`Ви впевнені, що хочете видалити категорію "${categoryName}"?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Помилка при видаленні категорії')
      }
    } catch (_) {
      alert('Помилка при видаленні категорії')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? 'Видалення...' : 'Видалити'}
    </Button>
  )
} 