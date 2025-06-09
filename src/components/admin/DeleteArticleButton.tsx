'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface DeleteArticleButtonProps {
  articleId: string
  articleTitle: string
}

export function DeleteArticleButton({ articleId, articleTitle }: DeleteArticleButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Ви впевнені, що хочете видалити статтю "${articleTitle}"?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Помилка при видаленні статті')
      }
    } catch (_) {
      alert('Помилка при видаленні статті')
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