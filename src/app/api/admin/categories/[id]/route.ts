import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if category has articles
    const articlesCount = await prisma.article.count({
      where: { categoryId: id }
    })

    if (articlesCount > 0) {
      return NextResponse.json({ 
        error: 'Неможливо видалити категорію, оскільки в ній є статті' 
      }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (_) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name } = await request.json()

    // Check if category name already exists for other categories
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name,
        id: { not: id }
      }
    })

    if (existingCategory) {
      return NextResponse.json({ error: 'Категорія з такою назвою вже існує' }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name }
    })

    return NextResponse.json(category)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
} 