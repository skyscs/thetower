import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { title, content, author, categoryId, slug } = await request.json()

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    })

    if (existingArticle) {
      return NextResponse.json({ error: 'Стаття з таким заголовком вже існує' }, { status: 400 })
    }

    const article = await prisma.article.create({
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
    revalidatePath(`/categories/${categoryId}`, 'page') // Category page
    revalidatePath(`/articles/${slug}`, 'page') // New article page

    return NextResponse.json(article)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title, content, author, categoryId, slug } = await request.json()

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
    revalidatePath(`/categories/${categoryId}`, 'page') // Category page
    revalidatePath(`/articles/${slug}`, 'page') // Updated article page

    return NextResponse.json(article)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
} 