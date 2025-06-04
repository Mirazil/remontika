// src/hooks/useIsAdmin.ts
'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/client/lib/firebaseAuth'
import { db } from '@/lib/firebase'

/**
 * Возвращает:
 *  - null, пока идёт проверка
 *  - true, если текущий пользователь — админ
 *  - false, если не админ или не залогинен
 */
export function useIsAdmin(): boolean | null {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false)
        return
      }

      try {
        const snapshot = await getDoc(doc(db, 'admins', user.uid))
        setIsAdmin(snapshot.exists())
      } catch (err) {
        console.error('Ошибка проверки админа:', err)
        setIsAdmin(false)
      }
    })

    return unsubscribe
  }, [])

  return isAdmin
}
