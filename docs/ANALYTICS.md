# Vercel Analytics та Speed Insights

## Налаштування аналітики

В проект додано два компонента від Vercel для відстеження трафіку та продуктивності:

### 1. Vercel Analytics (`@vercel/analytics`)
- **Призначення**: відстеження відвідувачів та перегляд сторінок
- **Дані**: кількість унікальних відвідувачів, переглядів сторінок, топ сторінки, країни, браузери
- **Локація**: `src/app/layout.tsx`

### 2. Vercel Speed Insights (`@vercel/speed-insights`) 
- **Призначення**: аналіз продуктивності сайту
- **Дані**: Core Web Vitals (LCP, FID, CLS), час завантаження, TTFB
- **Локація**: `src/app/layout.tsx`

## Встановлені пакети

```bash
npm install @vercel/analytics @vercel/speed-insights
```

## Код імплементації

```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Контент сайту */}
        <main>{children}</main>
        
        {/* Аналітика */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## Доступ до аналітики

1. **Analytics**: Vercel Dashboard → Project → Analytics
2. **Speed Insights**: Vercel Dashboard → Project → Speed Insights

## Автоматичний збір даних

- **Розробка**: аналітика не збирається в dev режимі
- **Продакшн**: автоматично активується після деплою на Vercel
- **Данные збираються**: після першого візиту користувачів

## Конфігурація

Компоненти працюють без додаткового налаштування:
- Автоматично визначають environment (dev/prod)
- Працюють тільки на Vercel хостингу
- Не потребують API ключів
- GDPR compliant (анонімні дані)

## Метрики що відстежуються

### Web Analytics:
- Унікальні відвідувачі
- Перегляди сторінок  
- Топ сторінки
- Референдери
- Країни та міста
- Браузери та пристрої

### Speed Insights:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB) 