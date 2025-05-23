// src/hooks/useIsAdmin.ts
'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
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
    const user = getAuth().currentUser
    if (!user) {
      setIsAdmin(false)
      return
    }

    const ref = doc(db, 'admins', user.uid)
    getDoc(ref)
      .then(snapshot => {
        setIsAdmin(snapshot.exists())
      })
      .catch((err) => {
        console.error('Ошибка проверки админа:', err)
        setIsAdmin(false)
      })
  }, [])

  return isAdmin
}
