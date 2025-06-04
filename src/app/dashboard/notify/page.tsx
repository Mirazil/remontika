// ───────── src/app/(shboard)/notify/page.tsx ─────────
'use client'

import { useEffect, useState }        from 'react'
import { getAuth }                    from 'firebase/auth'
import { doc, onSnapshot, setDoc, updateDoc, deleteField }    from 'firebase/firestore'
import Image                          from 'next/image'
import Spinner                        from '@/client/components/Spinner'
import PrimaryButton                  from '@/client/components/PrimaryButton'
import { db }                         from '@/lib/firebase'
import { linkBot } from './linkBot' // ← используем утилиту
import Fade from '@/client/components/Fade'
import DangerButton from '@/client/components/DangerButton'

type Method = 'telegram' | 'viber' | 'sms'
interface ProfileExtra {
  notifyMethod : Method | null
  notifyValue  : string
  tgChatId?    : number
}

const METHODS = [
  { id: 'telegram', label: 'Telegram', icon: '/dashboard/icons/telegram.svg' },
  {
    id: 'viber',
    label: 'Viber',
    icon: '/dashboard/icons/viber.svg',
    iconClass: 'scale-110',
  },
  {
    id: 'sms',
    label: 'SMS',
    icon: '/dashboard/icons/sms.svg',
    iconClass: 'scale-110',
  },
] satisfies { id: Method; label: string; icon: string; iconClass?: string }[]

export default function NotificationsPage() {
  /* --- auth --- */
  const user = getAuth().currentUser
  if (!user) return <p className="p-8 text-center">Ви не авторизовані 🙃</p>

  /* --- state --- */
  const [prof , setProf ] = useState<ProfileExtra>()
  const [method,setMethod] = useState<Method | null>(null)
  const [value , setValue ] = useState('')
  const [saved , setSaved ] = useState(false)
  const [linking, setLinking] = useState(false)
  const [unlinking, setUnlinking] = useState(false)

  /* --- subscribe users/{uid} --- */
  useEffect(() => {
    const ref = doc(db, 'users', user.uid)
    return onSnapshot(ref, snap => {
      if (snap.exists()) setProf(snap.data() as ProfileExtra)
      else {
        setDoc(ref, { notifyMethod: null, notifyValue: '' })
        setProf  ({ notifyMethod: null, notifyValue: '' })
      }
    })
  }, [user.uid])

  /* заполняем форму, когда профайл готов */
  useEffect(() => {
    if (!prof) return
    setMethod(prof.notifyMethod)
    setValue (prof.notifyValue )
  }, [prof])

  if (!prof) return <Spinner/>

  /* --- save prefs --- */
  const save = async () => {
    if (!method || !value.trim()) {
      alert('Оберіть спосіб та вкажіть посилання / номер')
      return
    }
    await setDoc(
      doc(db, 'users', user.uid),
      { notifyMethod: method, notifyValue: value.trim() },
      { merge: true },
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  /* --- link bot --- */
  const handleLinkBot = async () => {
    try {
      setLinking(true)
      const { docId, botName } = await linkBot()   // ← uid теперь уходит в заголовок
      window.open(`https://t.me/${botName}?start=${docId}`, '_blank')
    } catch (e) {
      console.error(e)
      alert('Не вдалося відкрити бота. Спробуйте пізніше.')
    } finally {
      setLinking(false)
    }
  }

  /* --- unlink bot --- */
  const handleUnlinkBot = async () => {
    if (!prof?.tgChatId) return
    try {
      setUnlinking(true)
      await updateDoc(doc(db, 'users', user.uid), { tgChatId: deleteField() })
    } catch (e) {
      console.error(e)
      alert('Не вдалося видалити зв\'язок. Спробуйте пізніше.')
    } finally {
      setUnlinking(false)
    }
  }

  const linkDisabled   = linking   || method !== 'telegram' || !!prof.tgChatId
  const unlinkDisabled = unlinking || method !== 'telegram' || !prof.tgChatId

  /* --- UI --- */
  return (
    <div className="relative mx-auto w-full max-w-[620px] px-4 py-8 flex flex-col items-center gap-6 sm:gap-10">
      {/* header */}
      <header className="mt-4 text-center">
        <h1 className="mb-1 text-2xl sm:text-3xl font-bold">
          Оберіть спосіб сповіщення про стан заявок
        </h1>
        <p className="text-sm text-gray-500">
          На обраний месенджер ви будете отримувати сповіщення щодо
          зміни&nbsp;стану
        </p>
      </header>

      {/* picker */}
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`
              flex flex-col items-center gap-4 rounded-2xl p-6 transition
              ${
                method === m.id
                  ? "bg-[#dbe8ff] scale-105 shadow"
                  : "hover:bg-[#eef4ff]"
              }
            `}
          >
            <Image
              src={m.icon}
              alt=""
              width={120}
              height={120}
              className={`w-16 h-16 sm:w-[120px] sm:h-[120px] object-contain ${m.iconClass ?? ''}`}
            />
            <span className="text-lg sm:text-xl font-semibold">{m.label}</span>
          </button>
        ))}
      </div>

      {/* input */}
      <div className="w-full text-center max-w-md space-y-6">
        <label className="flex flex-col gap-2 justify-center font-semibold">
          Вкажіть посилання чи номер телефону
          <div className="flex w-full items-center gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://t.me/…  або  +38 (067)…"
              className="
                flex-1 rounded-full border border-[#2C79FF]/60 px-6 py-2
                outline-none focus:ring-2 focus:ring-[#2C79FF]
              "
            />
            <PrimaryButton onClick={save} className="shrink-0">Зберегти</PrimaryButton>
          </div>
        </label>

        <p className="mt-8 text-center font-semibold">
          Бот: {prof.tgChatId ? "підключено ✅" : "не підключено ❌"}
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <PrimaryButton
            onClick={handleLinkBot}
            /* Однажды задаём disabled: */
            disabled={
              linking ||
              method !== "telegram" ||
              !!prof.tgChatId ||
              linkDisabled
            }
            /* Однажды задаём className, включая стили для disabled: */
            className={`
      disabled:opacity-40
      disabled:cursor-not-allowed
      ${method !== "telegram" ? "opacity-40 cursor-not-allowed" : ""}
    `}
          >
            {linking ? (
              <span
                className="
              flex h-5 w-5
              animate-spin
              border-2 border-white/40 border-t-white
              rounded-full
            "
              />
            ) : prof.tgChatId ? (
              "Бот підʼєднаний"
            ) : (
              "Підключити бота"
            )}
          </PrimaryButton>

          <DangerButton
            onClick={handleUnlinkBot}
            disabled={unlinkDisabled}
            className={`disabled:opacity-40 disabled:cursor-not-allowed ${
              method !== "telegram" || !prof.tgChatId
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
          >
            {unlinking ? (
              <span className="flex h-5 w-5 animate-spin border-2 border-white/40 border-t-white rounded-full" />
            ) : (
              "Відʼєднати бота"
            )}
          </DangerButton>
        </div>


      </div>

      {/* saved badge */}

      <Fade show={saved} duration={300} onFadeOutComplete={() => {}}>
        {saved && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up">
            <button
              disabled
              className="
              rounded-full border-2 border-[#2C79FF] bg-[#dbe8ff]/60
              px-8 py-2 font-semibold text-[#2C79FF] shadow
            "
            >
              Збережено
            </button>
          </div>
        )}
      </Fade>
    </div>
  );
}
