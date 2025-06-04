// src/app/dashboard/layout.tsx  (или как у вас называется DashboardLayout)
'use client';

import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/client/lib/firebaseAuth';
import '../globals.css';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import Spinner from '@/client/components/Spinner';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'; // иконки для бургер меню и стрелок
import clsx from 'clsx';

// Helper для кнопок навигации (осталось без изменений)
interface NavBtnProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavButton({ href, icon, label, active, onClick }: NavBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex w-full items-center gap-3 rounded-full border cursor-pointer
        border-[#2C79FF] px-6 py-3 text-left transition
        shadow-[0_4px_4px_rgba(44,121,255,0.4)]
        ${active ? 'bg-[#005dff1f]' : 'bg-white hover:bg-[#005dff0d]'}
      `}
    >
      <Image
        src={icon}
        alt=""
        width={20}
        height={20}
        className="shrink-0 opacity-80 group-hover:opacity-100"
      />
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin();        // проверяем, админ ли
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Слушаем состояние авторизации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        router.replace('/');
      }
    });
    return unsubscribe;
  }, [router]);

  // Пока статус admin неизвестен, показываем спиннер
  if (isAdmin === null) {
    return <Spinner />;
  }
  // Пока auth state инициализируется, ничего не рендерим
  if (user === undefined) {
    return null;
  }
  if (!user) {
    return null; // перенаправление вместо этого уже сделано выше
  }

  /* --------------------------------------------------
   *                ADMIN LAYOUT
   * ------------------------------------------------*/
  if (isAdmin) {
    return (
      <div className="relative flex min-h-screen">
        {/* ---------- sidebar (desktop only) ---------- */}
        <aside
          className={`
            hidden md:flex fixed md:relative top-0 bottom-0 z-40
            w-72 flex-col border-r border-[#2C79FF] bg-white
            transform transition-transform duration-200
            ${desktopSidebarOpen ? 'translate-x-0 md:translate-x-0' : '-translate-x-full md:-translate-x-full md:absolute'}
          `}
        >
          {/* Кнопка скрытия (desktop) */}
          <button
            onClick={() => setDesktopSidebarOpen(false)}
            className="hidden md:block absolute top-4 right-4 rounded-md p-1 hover:bg-gray-100"
            aria-label="Hide sidebar"
          >
            <ChevronLeft className="h-5 w-5 text-text/70" />
          </button>
          {/* avatar */}
          <div className="flex flex-col items-center gap-3 py-8">
            <Image
              src="/dashboard/icons/profile.svg"
              alt=""
              width={48}
              height={48}
            />
            <p className="font-semibold">admin</p>
          </div>

          {/* navigation  */}
          <nav className="flex flex-col gap-4 px-6">
            <NavButton
              href="/dashboard/admin/pending"
              icon="/dashboard/icons/list.svg"
              label="Очікують підтвердження"
              active={pathname === '/dashboard/admin/pending'}
              onClick={() => router.push('/dashboard/admin/pending')}
            />
            <NavButton
              href="/dashboard/admin/in-process"
              icon="/dashboard/icons/in-process.svg"
              label="У процесі"
              active={pathname === '/dashboard/admin/in-process'}
              onClick={() => router.push('/dashboard/admin/in-process')}
            />
            <NavButton
              href="/dashboard/admin/completed"
              icon="/dashboard/icons/completed.svg"
              label="Завершені"
              active={pathname === '/dashboard/admin/completed'}
              onClick={() => router.push('/dashboard/admin/completed')}
            />
          </nav>

          {/* logout */}
          <div className="mt-auto flex flex-col items-center gap-6 p-6">
            <button
              onClick={() => signOut(auth)}
              className="mx-auto flex items-center gap-2 rounded-full border border-[#2C79FF] px-8 py-3 text-sm font-semibold shadow-[0_4px_4px_rgba(44,121,255,0.4)] hover:bg-[#005dff0d] transition"
            >
              <Image
                src="/dashboard/icons/logout.svg"
                alt=""
                width={18}
                height={18}
              />
              Вийти
            </button>
            <span className="text-xs italic text-gray-400">DUІKT 2025</span>
          </div>
        </aside>

        {/* Кнопка показа сайдбара (desktop) */}
        {!desktopSidebarOpen && (
          <button
            onClick={() => setDesktopSidebarOpen(true)}
            className="absolute left-4 top-4 hidden rounded-md border border-[#2C79FF] bg-white p-1 shadow md:block"
            aria-label="Show sidebar"
          >
            <ChevronRight className="h-5 w-5 text-text/70" />
          </button>
        )}


        {/* ---------- контент (desktop + mobile) ---------- */}
        <main className={`flex-1 overflow-y-auto p-8 transition-[margin] duration-200 ${desktopSidebarOpen ? 'md:ml-72' : ''}`}>{children}</main>
      </div>
    );
  }

  /* --------------------------------------------------
   *              REGULAR USER LAYOUT
   * ------------------------------------------------*/
  return (
    <div className="relative flex min-h-screen">
      {/* ------------------------------- */}
      {/* Фон для затемнения при открытом mobileSidebarOpen */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ---------- sidebar (desktop и mobile-overlay) ---------- */}
      <aside
        className={clsx(
          'fixed top-0 left-0 bottom-0 z-50 w-72 flex-col border-r border-[#2C79FF] bg-white shadow-lg transform transition-transform duration-200 md:flex',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          desktopSidebarOpen ? 'md:relative md:translate-x-0' : 'md:absolute md:-translate-x-full'
        )}
      >
        {/* Кнопка скрытия сайдбара (desktop) */}
        {desktopSidebarOpen && (
          <button
            onClick={() => setDesktopSidebarOpen(false)}
            className="absolute top-4 right-4 hidden rounded-md p-1 hover:bg-gray-100 md:block"
            aria-label="Hide sidebar"
          >
            <ChevronLeft className="h-5 w-5 text-text/70" />
          </button>
        )}

        {/* Закрывающий крестик в mobile-режиме */}
        <div className="flex items-center justify-between px-6 py-4 md:hidden">
          <div />
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-md"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-text/70" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center gap-3 py-8">
          <Image
            src="/dashboard/icons/profile.svg"
            alt="avatar"
            width={48}
            height={48}
          />
          <p className="font-semibold text-center max-w-[9rem] truncate">
            {user.displayName ?? 'Користувач'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 px-6">
          <NavButton
            href="/dashboard"
            icon="/dashboard/icons/list.svg"
            label="Мої заявки"
            active={pathname === '/dashboard'}
            onClick={() => {
              router.push('/dashboard');
              setMobileSidebarOpen(false);
            }}
          />
          <NavButton
            href="/dashboard/notify"
            icon="/dashboard/icons/notification.svg"
            label="Метод повідомлення"
            active={pathname === '/dashboard/notify'}
            onClick={() => {
              router.push('/dashboard/notify');
              setMobileSidebarOpen(false);
            }}
          />
          <NavButton
            href="/dashboard/settings"
            icon="/dashboard/icons/settings.svg"
            label="Налаштування"
            active={pathname === '/dashboard/settings'}
            onClick={() => {
              router.push('/dashboard/settings');
              setMobileSidebarOpen(false);
            }}
          />
        </nav>

        {/* Logout */}
        <div className="mt-auto flex flex-col items-center gap-6 p-6">
          <button
            onClick={() => signOut(auth)}
            className="mx-auto flex items-center gap-2 rounded-full border border-[#2C79FF] px-8 py-3 text-sm font-semibold shadow-[0_4px_4px_rgba(44,121,255,0.4)] hover:bg-[#005dff0d] transition cursor-pointer"
          >
            <Image
              src="/dashboard/icons/logout.svg"
              alt=""
              width={18}
              height={18}
            />
            Вийти
          </button>
          <span className="text-xs italic text-gray-400">DUІKT 2025</span>
        </div>
      </aside>
      
      {/* Кнопка показа сайдбара (desktop) */}
      {!desktopSidebarOpen && (
        <button
          onClick={() => setDesktopSidebarOpen(true)}
          className="absolute left-4 top-4 hidden rounded-md border border-[#2C79FF] bg-white p-1 shadow md:block"
          aria-label="Show sidebar"
        >
          <ChevronRight className="h-5 w-5 text-text/70" />
        </button>
      )}

      {/* ---------- контент ---------- */}
      <main className={`flex-1 overflow-y-auto transition-[margin] duration-200 ${desktopSidebarOpen ? 'md:ml-72' : ''}`}>
        {/* Верхняя панель с гамбургером (мобильный режим) */}
        <header className="flex items-center justify-between bg-white px-4 py-3 shadow md:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-md"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6 text-text/70" />
          </button>
          <Image
            src="/dashboard/icons/profile.svg"
            alt="avatar"
            width={32}
            height={32}
          />
        </header>

        {/* Сама область контента под шапкой */}
        <div className="p-8 pt-0 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
