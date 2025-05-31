'use client'
// утиліта: запит на бекенд + UID у BODY
import { getAuth } from 'firebase/auth'

export async function linkBot(): Promise<{ docId: string; botName: string }> {
  const user = getAuth().currentUser
  if (!user) throw new Error('not-auth')

  const res = await fetch('/api/telegram/link', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ uid: user.uid }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`linkBot ${res.status}: ${txt}`)
  }

  return res.json()               // { docId, botName }
}
