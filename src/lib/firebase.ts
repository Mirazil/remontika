// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '../client/lib/firebaseConfig'


// Инициализируем приложение
const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

// Экспортируем auth для использования везде
export const storage = getStorage(app)
export const db = getFirestore(app)
