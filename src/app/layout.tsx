import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Гайди по The Tower Defense Idle",
  description: "Повний збірник стратегій, порад та гайдів для успішної гри в The Tower Defense Idle",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3 group">
                <Image
                  src="/logo.webp"
                  alt="The Tower Defense Idle Logo"
                  width={40}
                  height={40}
                  className="rounded-lg group-hover:scale-110 transition-transform"
                />
                <span className="text-2xl font-bold group-hover:text-yellow-300 transition-colors">
                  The Tower Defense Idle
                </span>
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/" className="hover:text-yellow-300 transition-colors font-medium">
                  Головна
                </Link>
                <Link href="/categories" className="hover:text-yellow-300 transition-colors font-medium">
                  Категорії
                </Link>
                <Link href="/articles" className="hover:text-yellow-300 transition-colors font-medium">
                  Всі статті
                </Link>
                <Button asChild variant="secondary" size="sm" className="bg-white text-purple-600 hover:bg-yellow-300 hover:text-purple-800 transition-all">
                  <Link href="/admin">
                    Адмін
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-muted-foreground">
              <p>&copy; 2025 Гайди по The Tower Defense Idle. Всі права захищені.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
