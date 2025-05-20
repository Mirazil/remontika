// src/app/layout.tsx
import './globals.css'
import { Open_Sans } from 'next/font/google'

// Подключаем нужные веса и поддержку кириллицы
const openSans = Open_Sans({
  subsets: ['cyrillic'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata = {
  title: 'Ремонтника',
  description: 'Сервіс ремонту смартфонів',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <html lang="uk" className={openSans.className}>
      <body className="bg-[url('/images/main_bg.png')] bg-cover bg-center text-black font-sans">
        <main>{children}</main>
        <footer className="p-4 text-center text-sm text-gray-500">© 2025</footer>
      </body>
    </html>
  )
}
