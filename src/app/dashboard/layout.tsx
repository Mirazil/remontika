// src/app/dashboard/layout.tsx
'use client'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function DashboardLayout({ children }:{ children:ReactNode }) {
  // ➜ три состояния:   undefined – ещё не знаем;  null – гостя нет;  User – авторизован
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const router = useRouter()

  /* следим за авторизацией */
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) router.replace('/')        // выход → на главную
    })
  }, [])

  /* пока неизвестно, кто мы – ничего не показываем */
  if (user === undefined) return null

  /* авторизованный интерфейс */
  return (
    <div className="flex min-h-screen">
      {/* ───────── sidebar ───────── */}
      <aside className="w-60 border-r p-6 flex flex-col gap-4 bg-gray-100">
        <p className="font-semibold truncate">{user?.displayName ?? 'Користувач'}</p>

        <button onClick={() => router.push('/dashboard')}        className="text-left">Мої заявки</button>
        <button onClick={() => router.push('/dashboard/settings')}className="text-left">Налаштування</button>

        <button
          onClick={() => signOut(auth)}           /* ← обнуляет пользователя */
          className="mt-auto rounded-lg border px-4 py-2 text-sm">
          Вийти
        </button>
      </aside>

      {/* ───────── основной контент ───────── */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
