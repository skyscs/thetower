# The Tower Defense Idle Guides

A comprehensive guide website for The Tower Defense Idle game built with Next.js, TypeScript, and shadcn/ui.

## Features

- **Static Site Generation (SSG)** - All pages are pre-rendered for optimal performance
- **Ukrainian Language** - Content is in Ukrainian for the target audience
- **Admin Panel** - Simple password-protected admin interface for content management
- **Article Management** - Full CRUD operations for articles with categories
- **SEO Optimized** - Proper meta tags and URL structure
- **Responsive Design** - Works on all devices
- **Database Ready** - PostgreSQL with Prisma ORM

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (Docker for development, Neon for production)
- **ORM**: Prisma
- **Deployment**: Vercel (serverless)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker (for local database)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd thetower
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/thetower"
ADMIN_PASSWORD="your-admin-password"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Start the database:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Seed the database with sample data:
```bash
npm run db:seed
```

7. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   ├── articles/          # Article pages
│   ├── categories/        # Category pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── admin/             # Admin-specific components
├── lib/                   # Utility functions
│   ├── prisma.ts          # Database client
│   ├── slug.ts            # Ukrainian transliteration
│   └── utils.ts           # General utilities
prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Sample data
```

## Database Schema

### Categories
- `id` - Unique identifier
- `name` - Category name (unique)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Articles
- `id` - Unique identifier
- `title` - Article title
- `slug` - URL-friendly version of title (unique)
- `content` - Article content
- `author` - Author name
- `categoryId` - Reference to category
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Admin Panel

Access the admin panel at `/admin` with the password set in `ADMIN_PASSWORD`.

### Features:
- Dashboard with statistics
- Article management (create, read, update, delete)
- Category management
- Simple password authentication

### Default Login:
- Password: `admin123` (change in `.env.local`)

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy

### Database Setup for Production

1. Create a Neon PostgreSQL database
2. Update `DATABASE_URL` in production environment
3. Run migrations: `npx prisma migrate deploy`

## Development

### Adding New Articles

1. Go to `/admin`
2. Login with admin password
3. Click "Create Article"
4. Fill in the form and submit

### Adding New Categories

1. Go to `/admin/categories`
2. Click "Create Category"
3. Enter category name and submit

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name migration-name

# Reset database
npx prisma migrate reset

# View database in browser
npx prisma studio
```

## Features Roadmap

- [ ] Image upload for articles
- [ ] Rich text editor
- [ ] Search functionality
- [ ] Tags system
- [ ] Comments system
- [ ] User authentication
- [ ] Article analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
