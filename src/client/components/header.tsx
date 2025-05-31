'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/client/lib/firebaseAuth';
import AuthModal from '@/client/components/AuthModal';

export default function Header() {
  const [showAuth, setShowAuth] = useState(false)
  const [user,     setUser    ] = useState<User | null>(null)
  const router                    = useRouter()

  /* === слушаем статус авторизации === */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  /* === обработка клика по иконке профиля === */
  function handleProfileClick() {
    if (user) {
      router.push('/dashboard')     // уже вошёл → в кабинет
    } else {
      setShowAuth(true)             // гость → открыть модалку
    }
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

          {/* логотип */}
          <img src="/images/remontika_logo.svg" alt="Remontika" className="h-15"/>

          {/* навигация */}
          <nav className="flex-1 hidden lg:flex justify-center gap-14 text-text text-lg font-light">
            <a href="#benefits">Про нас</a>
            <a href="#services">Перелік ремонту</a>
            <a href="#works">Приклад робіт</a>
            <a href="#reviews">Відгуки</a>
            <a href="#contacts">Контакти</a>
          </nav>

          {/* профиль / вход */}
          <button
            onClick={handleProfileClick}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full cursor-pointer"
          >
            <img src="/images/my_account_button.svg" alt="account" className="h-15"/>
          </button>
        </div>
      </header>

      {/* модалка авторизации */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
