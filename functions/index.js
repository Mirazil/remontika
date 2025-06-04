/* eslint-disable camelcase */
require('dotenv').config();

/* ─────────── Firebase Admin ─────────── */
const { initializeApp }      = require('firebase-admin/app');
const { getFirestore }       = require('firebase-admin/firestore');
initializeApp();
const db = getFirestore();

/* ─────────── Gen-2 Cloud Functions ─────────── */
const { onRequest }          = require('firebase-functions/v2/https');
const { onDocumentUpdated }  = require('firebase-functions/v2/firestore');

/* ─────────── Telegram credentials ─────────── */
const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  (require('firebase-functions').config().telegram || {}).bot_token;

if (!BOT_TOKEN) throw new Error('BOT_TOKEN missing');

const TG_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/* ─────────── Людяні назви статусів ─────────── */
const STATUS_LABELS = {
  pending          : 'Очікує підтвердження',
  delivery_wait    : 'Очікує початку доставки',
  repair           : 'Процес ремонту',
  repair_done      : 'Ремонт завершено',
  courier_to_client: 'Кур’єр прямує до клієнта',
  done             : 'Завершено',
};

/* ─────────────────────────────────────────────
   1.  Web-hook  (/start <docId>)
   ───────────────────────────────────────────── */
exports.telegramWebhook = onRequest(
  { region: 'us-central1', timeoutSeconds: 60, memory: '256Mi' },
  async (req, res) => {
    try {
      if (req.method !== 'POST') return res.status(405).send('Only POST');

      const msg = req.body?.message;
      if (!msg?.text?.startsWith('/start')) return res.sendStatus(200);

      const [, docId] = msg.text.split(' ');
      if (!docId) return res.sendStatus(200);

      /* одноразовый токен существует? */
      const snap = await db.doc(`tgLinkTokens/${docId}`).get();
      if (!snap.exists) return res.sendStatus(200);

      /* сохраняем chatId в профиле пользователя */
      const { uid } = snap.data();
      await db.doc(`users/${uid}`).set({ tgChatId: msg.chat.id }, { merge: true });
      await snap.ref.delete();

      /* приветствуем пользователя */
      await fetch(`${TG_URL}/sendMessage`, {
        method : 'POST',
        headers: { 'content-type': 'application/json' },
        body   : JSON.stringify({
          chat_id: msg.chat.id,
          text   : 'Сповіщення увімкнені ✅',
        }),
      });

      return res.sendStatus(200);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
);

/* ─────────────────────────────────────────────
   2.  Firestore-триггер: оновлення статусу
   ───────────────────────────────────────────── */
exports.requestStatusChanged = onDocumentUpdated(
  { region: 'us-central1', document: 'requests/{reqId}' },
  async (event) => {
    const before = event.data.before.data();
    const after  = event.data.after.data();

    /* статус не змінився – виходимо */
    if (before.status === after.status) return;

    /* дістаємо chatId власника заявки */
    const userSnap = await db.doc(`users/${after.userId}`).get();
    const { tgChatId, notifyMethod } = userSnap.data() || {};

    if (notifyMethod !== 'telegram' || !tgChatId) return;

    /* читаємо людську назву статусу */
    const statusLabel = STATUS_LABELS[after.status] || after.status;

    /* формуємо повідомлення */
    const text =
      `Замовлення #${event.params.reqId.slice(-4)} ` +
      `оновлено: *${statusLabel}*`;

    /* надсилаємо */
    await fetch(`${TG_URL}/sendMessage`, {
      method : 'POST',
      headers: { 'content-type': 'application/json' },
      body   : JSON.stringify({
        chat_id   : tgChatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
  }
);
// 2) Next.js SSR: Функция nextjsServer (автоматически генерируется CLI):
//
//    Так как вы уже сделали `firebase init hosting` с поддержкой Next.js, 
//    Firebase CLI создал пакет `firebase-frameworks-<ваш-проект>` внутри `functions/node_modules`.
//    Из него мы заберём конструктор серверного рендерера:
const { nextjsServer } = require("firebase-frameworks-olehrepairwebsite");

// Экспортируем функцию, которую укажем в firebase.json → "rewrites": "function": "nextjsServer"
exports.nextjsServer = onRequest({ region: "us-central1" }, (req, res) => {
  // “nextjsServer” внутри сам дозагружает файлы из .next/ и отрендерит нужную страницу
  return nextjsServer(req, res);
});
