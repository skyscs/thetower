import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    })

    if (existingCategory) {
      return NextResponse.json({ error: 'Категорія з такою назвою вже існує' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name }
    })

    return NextResponse.json(category)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
} 