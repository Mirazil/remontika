// src/app/dashboard/layout.tsx
'use client'

import Image from 'next/image'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import '../globals.css'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import Spinner from '@/components/Spinner'

// Helper for navigation buttons
interface NavBtnProps {
  href: string
  icon: string
  label: string
  active?: boolean
  onClick: () => void
}

function NavButton({ href, icon, label, active, onClick }: NavBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex w-full items-center gap-3 rounded-full border
        border-[#2C79FF] px-6 py-3 text-left transition
        shadow-[0_4px_4px_rgba(44,121,255,0.4)]
        ${active ? 'bg-[#005dff1f]' : 'bg-white hover:bg-[#005dff0d]'}
      `}
    >
      <Image src={icon} alt="" width={20} height={20} className="shrink-0 opacity-80 group-hover:opacity-100" />
      <span className="truncate">{label}</span>
    </button>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // 1) Determine if user is admin
  const isAdmin = useIsAdmin()

  // 2) Listen for auth state
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) {
        router.replace('/')
      }
    })
    return unsubscribe
  }, [router])

  // 3) While admin status unknown, show spinner
  if (isAdmin === null) {
    return <Spinner />
  }

  // 4) While auth state initializing, render nothing
  if (user === undefined) {
    return null
  }

  // If not logged in, redirect handled above
  if (!user) {
    return null
  }

  // 5) Admin sees separate UI (to be implemented)
  if (isAdmin) {
    return (
      <div className="flex min-h-screen">
        <aside className="w-72 p-6 bg-gray-50 border-r">Admin Sidebar</aside>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
                {/* Logout */}
        <div className="mt-auto flex flex-col items-center gap-6 p-6">
          <button onClick={() => signOut(auth)} className="mx-auto flex items-center gap-2 rounded-full border border-[#2C79FF] px-8 py-3 text-sm font-semibold shadow-[0_4px_4px_rgba(44,121,255,0.4)] hover:bg-[#005dff0d] transition">
            <Image src="/dashboard/icons/logout.svg" alt="" width={18} height={18} />
            Вийти
          </button>
          <span className="text-xs italic text-gray-400">DUIKT 2025</span>
        </div>
      </div>
    )
  }

  // 6) Regular user dashboard
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-72 flex-col border-r border-[#2C79FF] bg-white">
        {/* Profile */}
        <div className="flex flex-col items-center gap-3 py-8">
          <Image
            src="/dashboard/icons/profile.svg"
            alt="avatar"
            width={48}
            height={48}
          />
          <p className="font-semibold text-center max-w-[9rem] truncate">
            {user.displayName ?? "Користувач"}
          </p>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-4 px-6">
          <NavButton
            href="/dashboard"
            icon="/dashboard/icons/list.svg"
            label="Мої заявки"
            active={pathname === "/dashboard"}
            onClick={() => router.push("/dashboard")}
          />
          <NavButton
            href="/dashboard/notify"
            icon="/dashboard/icons/notification.svg"
            label="Метод повідомлення"
            active={pathname === "/dashboard/notify"}
            onClick={() => router.push("/dashboard/notify")}
          />
          <NavButton
            href="/dashboard/settings"
            icon="/dashboard/icons/settings.svg"
            label="Налаштування"
            active={pathname === "/dashboard/settings"}
            onClick={() => router.push("/dashboard/settings")}
          />
        </nav>
        {/* Logout */}
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
          <span className="text-xs italic text-gray-400">DUIKT 2025</span>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
