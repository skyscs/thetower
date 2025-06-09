import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get article data before deletion for revalidation
    const article = await prisma.article.findUnique({
      where: { id },
      select: { slug: true, categoryId: true }
    })

    await prisma.article.delete({
      where: { id }
    })

    if (article) {
      // Revalidate pages where this article was displayed
      revalidatePath('/', 'page') // Main page
      revalidatePath('/articles', 'page') // All articles page
      revalidatePath(`/categories/${article.categoryId}`, 'page') // Category page
      revalidatePath(`/articles/${article.slug}`, 'page') // Deleted article page
    }

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

    // Get old article data for revalidation
    const oldArticle = await prisma.article.findUnique({
      where: { id },
      select: { slug: true, categoryId: true }
    })

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

    // Revalidate pages where this article may appear
    revalidatePath('/', 'page') // Main page
    revalidatePath('/articles', 'page') // All articles page
    revalidatePath(`/categories/${categoryId}`, 'page') // New category page
    revalidatePath(`/articles/${slug}`, 'page') // Updated article page
    
    // If category changed, revalidate old category page
    if (oldArticle && oldArticle.categoryId !== categoryId) {
      revalidatePath(`/categories/${oldArticle.categoryId}`, 'page')
    }
    
    // If slug changed, revalidate old article page
    if (oldArticle && oldArticle.slug !== slug) {
      revalidatePath(`/articles/${oldArticle.slug}`, 'page')
    }

    return NextResponse.json(article)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
} 