import { PrismaClient } from '@prisma/client'
import { createSlug } from '../src/lib/slug'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Початківцям' },
      update: {},
      create: { name: 'Початківцям' }
    }),
    prisma.category.upsert({
      where: { name: 'Стратегії' },
      update: {},
      create: { name: 'Стратегії' }
    }),
    prisma.category.upsert({
      where: { name: 'Оптимізація' },
      update: {},
      create: { name: 'Оптимізація' }
    }),
    prisma.category.upsert({
      where: { name: 'Поради' },
      update: {},
      create: { name: 'Поради' }
    })
  ])

  // Create sample articles
  const articles = [
    {
      title: 'Як почати грати в The Tower Defense Idle',
      content: `The Tower Defense Idle - це захоплююча гра, яка поєднує елементи tower defense та idle gaming. У цій статті ми розглянемо основи гри та дамо поради для початківців.

Основи гри:
1. Будуйте вежі для захисту від ворогів
2. Покращуйте свої вежі для збільшення урону
3. Збирайте ресурси навіть коли не граєте
4. Досліджуйте нові технології

Перші кроки:
- Почніть з простих веж
- Зосередьтеся на покращенні основних веж
- Не забувайте про автоматичний збір ресурсів
- Регулярно перевіряйте прогрес

Ця гра ідеально підходить для тих, хто любить стратегічні ігри з елементами прогресії.`,
      author: 'Адміністратор',
      categoryId: categories[0].id
    },
    {
      title: 'Найкращі стратегії для швидкого прогресу',
      content: `Для досягнення швидкого прогресу в The Tower Defense Idle важливо дотримуватися певних стратегій.

Основні принципи:
1. Фокусуйтеся на покращенні найефективніших веж
2. Балансуйте між атакою та захистом
3. Використовуйте синергію між різними типами веж
4. Плануйте довгострокові інвестиції

Економічна стратегія:
- Інвестуйте в ресурсні вежі на початку
- Покращуйте швидкість збору ресурсів
- Не витрачайте всі ресурси одразу
- Зберігайте частину для екстрених ситуацій

Бойова стратегія:
- Розміщуйте вежі стратегічно
- Комбінуйте різні типи атак
- Покращуйте критичний урон
- Використовуйте спеціальні здібності

Ці стратегії допоможуть вам швидко прогресувати та досягати нових рівнів.`,
      author: 'Експерт гри',
      categoryId: categories[1].id
    },
    {
      title: 'Оптимізація ресурсів та економіки',
      content: `Правильне управління ресурсами - ключ до успіху в The Tower Defense Idle.

Типи ресурсів:
1. Золото - основна валюта
2. Кристали - преміум ресурс
3. Досвід - для покращення веж
4. Матеріали - для крафтингу

Стратегії збору:
- Встановлюйте автоматичні збирачі
- Покращуйте швидкість генерації
- Використовуйте бонуси та множники
- Плануйте час збору

Витрати ресурсів:
- Пріоритизуйте найважливіші покращення
- Не витрачайте ресурси на непотрібні речі
- Зберігайте резерв для важливих моментів
- Інвестуйте в довгострокові покращення

Економічні поради:
- Регулярно перевіряйте баланс ресурсів
- Використовуйте всі доступні джерела доходу
- Плануйте великі витрати заздалегідь
- Не забувайте про пасивний дохід

Правильна економічна стратегія забезпечить стабільний прогрес у грі.`,
      author: 'Економіст',
      categoryId: categories[2].id
    }
  ]

  for (const articleData of articles) {
    const slug = createSlug(articleData.title)
    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        ...articleData,
        slug
      }
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 