import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

/* ─ ініціалізація Admin SDK ─ */
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

const BOT_NAME = process.env.TG_BOT_NAME as string

export async function POST(req: NextRequest) {
  try {
    /* —— розбір body —— */
    const { uid, docId } = await req.json() as { uid?: string; docId?: string }
    if (!uid) return NextResponse.json({ error: 'unauth' }, { status: 401 })

    const finalId = docId || uuid()

    /* —— одноразовий токен —— */
    await db.doc(`tgLinkTokens/${finalId}`).set({
      uid,
      createdAt: Date.now(),
    })

    return NextResponse.json({ docId: finalId, botName: BOT_NAME })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
