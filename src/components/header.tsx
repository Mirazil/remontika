/* eslint-disable @next/next/no-img-element */
// import Link from 'next/link'

'use client'

import { useState } from 'react'
import AuthModal from '@/components/AuthModal'

export default function Header() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* логотип */}
          <img src="/images/remontika_logo.svg" alt="Remontika" className="h-15" />

          {/* навигация */}
          <nav className="flex-1 hidden lg:flex justify-center gap-14 text-[#303030] text-lg font-light">
            <a href="#benefits">Про нас</a>
            <a href="#services">Перелік ремонту</a>
            <a href="#works">Приклад робіт</a>
            <a href="#reviews">Відгуки</a>
            <a href="#contacts">Контакти</a>
          </nav>

          {/* кнопка профиля */}
          <button
            onClick={() => setShowAuth(true)}
            className="ml-auto h-9 w-9 rounded-full flex items-center justify-center"
          >
            <img src="/images/my_account_button.svg" alt="account" className="h-15" />
          </button>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
