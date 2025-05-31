/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

/* --- Admin SDK (одноразово) --- */
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId  : process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey : process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}
const db = getFirestore()

export async function POST(req: NextRequest) {
  /* 1. отримуємо повний апдейт від Telegram */
  const update = await req.json()

  /* 2. Цікавить тільки /start <docId> у приватному чаті */
  const msg = update.message
  if (!msg || msg.chat.type !== 'private') return NextResponse.json({ ok:true })

  const entities = msg.entities ?? []
  const isStart  = entities.some((e:any) => e.offset===0 && e.type==='bot_command')
  if (!isStart)  return NextResponse.json({ ok:true })

  /* 3. Витягаємо docId (друге слово у повідомленні) */
  const [, docId] = msg.text.split(' ')
  if (!docId) return NextResponse.json({ ok:true })

  /* 4. Шукаємо токен у Firestore */
  const tokenRef = db.doc(`tgLinkTokens/${docId}`)
  const snap     = await tokenRef.get()
  if (!snap.exists) return NextResponse.json({ ok:true })

  const { uid } = snap.data() as { uid:string }

  /* 5. Пишемо chatId у профіль та видаляємо токен */
  await Promise.all([
    db.doc(`users/${uid}`).set({ tgChatId: msg.chat.id }, { merge:true }),
    tokenRef.delete(),
  ])

  /* 6. Вітальне повідомлення */
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify({
        chat_id: msg.chat.id,
        text   : 'Сповіщення увімкнено ✅',
      }),
    },
  )

  return NextResponse.json({ ok:true })
}
