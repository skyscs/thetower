import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.article.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (_) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { title, content, author, categoryId, slug } = await request.json()

    // Check if slug already exists for other articles
    const existingArticle = await prisma.article.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    })

    if (existingArticle) {
      return NextResponse.json({ error: 'Стаття з таким заголовком вже існує' }, { status: 400 })
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        author,
        categoryId,
        slug
      }
    })

    return NextResponse.json(article)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
} 