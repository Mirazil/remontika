import './globals.css';
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['cyrillic'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata = {
  title: 'Ремонтника - ремонт смартфонів',
  description: 'Сервіс ремонту смартфонів',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <html lang="uk" className={`${openSans.className} scroll-smooth`}>
      <body className="bg-[url('/images/main_bg.png')] bg-cover bg-center text-[#303030] font-sans">
        <main>{children}</main>
      </body>
    </html>
  )
}
