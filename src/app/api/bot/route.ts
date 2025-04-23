// src/app/api/bot/route.ts
import { NextResponse } from 'next/server'
import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string)

export async function POST(request: Request) {
  const { message } = await request.json()
  await bot.telegram.sendMessage(
    process.env.TELEGRAM_CHAT_ID as string,
    message
  )
  return NextResponse.json({ status: 'sent' })
}
