'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

// инициализируем/получаем приложение
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// переменная для auth
let auth: Auth;

try {
  // Попытка инициализировать Auth с локальной персистенцией
  auth = initializeAuth(app, { persistence: browserLocalPersistence });
} catch (err) {
  // Если мы, например, оказались на сервере, или initializeAuth не сработал
  auth = getAuth(app);
}

export { auth };
