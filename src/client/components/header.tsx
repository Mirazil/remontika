'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/client/lib/firebaseAuth';
import AuthModal from '@/client/components/AuthModal';
import { X, Menu } from 'lucide-react'; // иконки для закрытия и гамбургера

export default function Header() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  /* === слушаем статус авторизации === */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  /* === обработка клика по иконке профиля === */
  function handleProfileClick() {
    if (user) {
      router.push('/dashboard'); // уже вошёл → в кабинет
    } else {
      setShowAuth(true); // гость → открыть модалку
    }
  }

  /* === закрыть мобильное меню при клике на ссылку или вне меню === */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="
          fixed inset-x-0 top-0 z-40
          bg-white/70 backdrop-blur
          shadow-sm
        "
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Логотип + якорь */}
          <a href="#hero">
            <img
              src="/images/remontika_logo.svg"
              alt="Remontika"
              className="h-8 w-auto select-none"
            />
          </a>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex flex-1 justify-center gap-10 text-text text-lg font-light">
            <a href="#benefits" className="hover:text-[#2C79FF]">
              Про нас
            </a>
            <a href="#services" className="hover:text-[#2C79FF]">
              Перелік ремонту
            </a>
            <a href="#works" className="hover:text-[#2C79FF]">
              Приклад робіт
            </a>
            <a href="#reviews" className="hover:text-[#2C79FF]">
              Відгуки
            </a>
            <a href="#contacts" className="hover:text-[#2C79FF]">
              Контакти
            </a>
          </nav>

          {/* Кнопка "гамбургер" для мобильной навигации */}
          <button
            className="lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-text/70" />
            ) : (
              <Menu className="h-6 w-6 text-text/70" />
            )}
          </button>

          {/* Кнопка профиль / вход */}
          <button
            onClick={handleProfileClick}
            className="ml-4 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Profile or Login"
          >
            <img
              src="/images/my_account_button.svg"
              alt="account"
              className="h-6 w-6"
            />
          </button>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col space-y-2 px-6 py-4">
              <a
                href="#benefits"
                onClick={closeMobileMenu}
                className="py-2 text-base font-medium text-text hover:text-[#2C79FF]"
              >
                Про нас
              </a>
              <a
                href="#services"
                onClick={closeMobileMenu}
                className="py-2 text-base font-medium text-text hover:text-[#2C79FF]"
              >
                Перелік ремонту
              </a>
              <a
                href="#works"
                onClick={closeMobileMenu}
                className="py-2 text-base font-medium text-text hover:text-[#2C79FF]"
              >
                Приклад робіт
              </a>
              <a
                href="#reviews"
                onClick={closeMobileMenu}
                className="py-2 text-base font-medium text-text hover:text-[#2C79FF]"
              >
                Відгуки
              </a>
              <a
                href="#contacts"
                onClick={closeMobileMenu}
                className="py-2 text-base font-medium text-text hover:text-[#2C79FF]"
              >
                Контакти
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Подушка, чтобы контент не уехал под фиксированный хедер */}
      <div className="h-14 lg:h-auto" />

      {/* Модалка авторизации */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
