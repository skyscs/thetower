# Инструкция деплоя на Vercel с Neon Database

## Шаг 1: Подготовка базы данных Neon

### 1.1 Создание аккаунта Neon
1. Перейдите на [https://neon.tech](https://neon.tech)
2. Зарегистрируйтесь или войдите в аккаунт
3. Нажмите "Create your first project"

### 1.2 Настройка проекта в Neon
1. **Название проекта**: `thetower-production`
2. **Регион**: выберите ближайший к вашим пользователям (рекомендуется EU для Украины)
3. **PostgreSQL версия**: 15 (по умолчанию)
4. Нажмите "Create project"

### 1.3 Получение строки подключения
1. В панели Neon перейдите в "Dashboard"
2. Скопируйте "Connection string" (начинается с `postgresql://`)
3. Сохраните эту строку - она понадобится для Vercel

Пример строки подключения:
```
postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## Шаг 2: Подготовка проекта

### 2.1 Создание environment файлов
Создайте файл `.env.example`:
```bash
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
ADMIN_PASSWORD="your-admin-password"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### 2.2 Обновление .gitignore
Убедитесь, что в `.gitignore` есть:
```
.env
.env.local
.env.production
```

### 2.3 Добавление скрипта для деплоя
В `package.json` добавьте скрипт:
```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "prisma generate",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## Шаг 3: Настройка Vercel

### 3.1 Создание проекта в Vercel
1. Перейдите на [https://vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите ваш GitHub репозиторий `thetower`
5. Настройте проект:
   - **Framework Preset**: Next.js
   - **Root Directory**: оставьте пустым
   - **Build Command**: `npm run build`
   - **Output Directory**: оставьте пустым

### 3.2 Настройка Environment Variables
В настройках Vercel проекта добавьте переменные:

1. **DATABASE_URL**
   - Value: ваша строка подключения Neon
   - Environment: Production, Preview, Development

2. **ADMIN_PASSWORD**
   - Value: надежный пароль для админ-панели
   - Environment: Production, Preview, Development

3. **NEXTAUTH_SECRET**
   - Value: случайная строка (сгенерируйте на openssl.org)
   - Environment: Production, Preview, Development

4. **NEXTAUTH_URL**
   - Value: `https://your-domain.vercel.app`
   - Environment: Production только

### 3.3 Генерация NEXTAUTH_SECRET
Выполните команду или используйте онлайн генератор:
```bash
openssl rand -base64 32
```

## Шаг 4: Миграция базы данных

### 4.1 Локальная генерация миграций
```bash
# Создайте миграцию
npx prisma migrate dev --name init

# Убедитесь, что миграции применились
npx prisma generate
```

### 4.2 Применение миграций в Neon
```bash
# Установите DATABASE_URL для продакшена
export DATABASE_URL="your-neon-connection-string"

# Примените миграции
npx prisma migrate deploy

# Заполните базу начальными данными
npm run db:seed
```

## Шаг 5: Деплой

### 5.1 Пуш кода в GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 5.2 Автоматический деплой
- Vercel автоматически задеплоит проект после push
- Следите за процессом в Vercel Dashboard
- Первый деплой может занять 2-3 минуты

### 5.3 Проверка деплоя
1. Откройте ваш домен (например: `https://thetower-abc123.vercel.app`)
2. Проверьте работу главной страницы
3. Протестируйте админ-панель: `/admin`
4. Убедитесь, что данные загружаются корректно

## Шаг 6: Настройка custom domain (опционально)

### 6.1 В Vercel
1. Перейдите в Settings > Domains
2. Добавьте ваш домен
3. Следуйте инструкциям для настройки DNS

### 6.2 Обновление NEXTAUTH_URL
Обновите переменную `NEXTAUTH_URL` на ваш кастомный домен.

## Проверочный чек-лист

- [ ] ✅ Создан проект в Neon
- [ ] ✅ Получена строка подключения к БД
- [ ] ✅ Создан проект в Vercel
- [ ] ✅ Настроены environment variables
- [ ] ✅ Сгенерирован NEXTAUTH_SECRET
- [ ] ✅ Применены миграции в Neon
- [ ] ✅ Заполнена база тестовыми данными
- [ ] ✅ Код запушен в GitHub
- [ ] ✅ Деплой завершен успешно
- [ ] ✅ Сайт открывается и работает
- [ ] ✅ Админ-панель доступна
- [ ] ✅ База данных работает

## Полезные команды

### Локальная разработка
```bash
npm run dev              # Запуск dev сервера
npm run build           # Сборка проекта
npm run start           # Запуск production сборки
```

### База данных
```bash
npx prisma studio       # Открыть Prisma Studio
npx prisma migrate dev  # Создать и применить миграцию
npx prisma generate     # Сгенерировать Prisma Client
npm run db:seed         # Заполнить базу тестовыми данными
```

### Vercel CLI (опционально)
```bash
npm i -g vercel         # Установка Vercel CLI
vercel                  # Деплой из командной строки
vercel --prod           # Деплой в продакшен
vercel logs             # Просмотр логов
```

## Устранение проблем

### Ошибки миграции
```bash
# Сброс базы (ОСТОРОЖНО - удалит все данные)
npx prisma migrate reset

# Применение миграций заново
npx prisma migrate deploy
```

### Проблемы с Environment Variables
- Проверьте правильность названий переменных
- Убедитесь, что переменные настроены для всех environment
- Перезадеплойте проект после изменения переменных

### Проблемы с подключением к БД
- Проверьте строку подключения Neon
- Убедитесь, что в строке есть `?sslmode=require`
- Проверьте, что IP не заблокирован в Neon

## Мониторинг и логи

1. **Vercel Dashboard**: основные метрики и логи деплоя
2. **Neon Dashboard**: мониторинг базы данных
3. **Vercel Functions**: логи серверных функций
4. **Real User Monitoring**: аналитика производительности

Удачного деплоя! 🚀 