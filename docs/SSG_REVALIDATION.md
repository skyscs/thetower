# SSG та Revalidation

## Налаштування Static Site Generation (SSG)

Для оптимізації продуктивності та SEO наступні сторінки налаштовані на SSG:

### Статичні сторінки:
- **Головна сторінка (`/`)**: `force-static`
- **Всі статті (`/articles`)**: `force-static`  
- **Сторінки статей (`/articles/[slug]`)**: `force-static` + `generateStaticParams`
- **Сторінки категорій (`/categories/[id]`)**: `force-static` + `generateStaticParams`

### Налаштування:
```typescript
export const dynamic = 'force-static'
export const revalidate = false // ISR only via revalidatePath
```

## Revalidation при змінах

### API роути з revalidation:

#### Статті (`/api/admin/articles/*`):
- **POST** (створення): перегенерує `/`, `/articles`, `/categories/{categoryId}`, `/articles/{slug}`
- **PUT** (оновлення): перегенерує `/`, `/articles`, категорії (стару і нову), статті (стару і нову)
- **DELETE** (видалення): перегенерує `/`, `/articles`, `/categories/{categoryId}`, `/articles/{slug}`

#### Категорії (`/api/admin/categories/*`):
- **POST** (створення): перегенерує `/`
- **PUT** (оновлення): перегенерує `/`, `/categories/{id}`
- **DELETE** (видалення): перегенерує `/`, `/categories/{id}`

### Тип revalidation:
```typescript
revalidatePath(path, 'page') // Перегенерація конкретної сторінки
```

## Переваги

1. **Швидкість**: Статичні сторінки завантажуються миттєво
2. **SEO**: Кращі позиції в пошукових системах
3. **Економія ресурсів**: Менше навантаження на сервер і базу даних
4. **Автоматичне оновлення**: Сторінки оновлюються при змінах через адмін-панель

## Розгортання

При build статично генеруються:
- Всі існуючі статті: `/articles/{slug}`
- Всі існуючі категорії: `/categories/{id}`
- Головна сторінка та сторінка всіх статей

Нові статті та категорії автоматично генеруються при першому доступі та кешуються. 