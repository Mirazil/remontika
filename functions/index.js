/* eslint-disable camelcase */
require('dotenv').config();

/* ─────────── Firebase Admin ─────────── */
const { initializeApp } = require('firebase-admin/app');
const { getFirestore }  = require('firebase-admin/firestore');
initializeApp();
const db = getFirestore();

/* ─────────── Gen-2 Cloud Functions ─────────── */
const { onRequest }         = require('firebase-functions/v2/https');
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');

/* ─────────── Telegram credentials ─────────── */
const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  (require('firebase-functions').config().telegram || {}).bot_token;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN missing');
}

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

/* ───────────── Эмодзи в ответах  ───────────── */
const STATUS_EMOJIS = {
  pending          : '⏳',
  delivery_wait    : '📦',
  repair           : '🔧',
  repair_done      : '✅',
  courier_to_client: '🚚',
  done             : '🎉',
};


/* ─────────────────────────────────────────────
   1.  Web-hook  (/start <docId>)
   ───────────────────────────────────────────── */
exports.telegramWebhook = onRequest(
  { region: 'us-central1', timeoutSeconds: 60, memory: '256Mi' },
  async (req, res) => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).send('Only POST');
      }

      const msg = req.body?.message;
      if (!msg?.text?.startsWith('/start')) {
        return res.sendStatus(200);
      }

      const [, docId] = msg.text.split(' ');
      if (!docId) {
        return res.sendStatus(200);
      }

      /* одноразовый токен существует? */
      const snap = await db.doc(`tgLinkTokens/${docId}`).get();
      if (!snap.exists) {
        return res.sendStatus(200);
      }

      /* сохраняем chatId в профиле пользователя */
      const { uid } = snap.data();
      await db.doc(`users/${uid}`).set({ tgChatId: msg.chat.id }, { merge: true });
      await snap.ref.delete();

      /* приветствуем пользователя */
      await fetch(`${TG_URL}/sendMessage`, {
        method : 'POST',
        headers: { 'content-type': 'application/json' },
        body   : JSON.stringify({
          chat_id   : msg.chat.id,
          text      :
            'У вас підключен бот, отже ви будете отримувати сповіщення про зміну статусу! ❤️ _(для відключення перейдіть у "Метод налаштування" та відключіть)_',
          parse_mode: 'Markdown',
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
   2.  Firestore-триггер: обновление статуса
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
    const emoji       = STATUS_EMOJIS[after.status] || '';

    const base =
      `Замовлення *${event.params.reqId.slice(-4)}* ` +
      `*${after.brand}* *${after.model}* Оновлено!`;

    let text;
    if (after.status === 'pending') {
      text = `${base}\n\nСтатус: *${statusLabel}* ${emoji}`;
    } else if (after.status === 'done') {
      text = `${base}\n\nСтатус: *${statusLabel}* ${emoji}\nДякую, що ви з нами! ❤️`;
    } else {
      text = `${base}\n\nСтатус: *${statusLabel}* ${emoji}`;
    }

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

/* ─────────────────────────────────────────────
   3.  Next.js-функция (ручная конфигурация без firebase-frameworks)
   ───────────────────────────────────────────── */
const next = require('next');
const dev = false; // в продакшене выставляем false
const app = next({
  dev,
  // путь к собранным файлам .next (сборка Next.js идёт в корень проекта, поэтому ../.next)
  conf: { distDir: '../.next' }
});
const handle = app.getRequestHandler();

exports.nextjsServer = onRequest(
  { region: 'us-central1' },
  (req, res) => {
    return app.prepare().then(() => handle(req, res));
  }
);
