// ───────── src/app/(dashboard)/notify/page.tsx ─────────
'use client'

import { useEffect, useState }        from 'react'
import { getAuth }                    from 'firebase/auth'
import { doc, onSnapshot, setDoc }    from 'firebase/firestore'
import Image                          from 'next/image'
import Spinner                        from '@/client/components/Spinner'
import PrimaryButton                  from '@/client/components/PrimaryButton'
import { db }                         from '@/lib/firebase'
import { linkBot } from './linkBot' // ← используем утилиту
import Fade from '@/client/components/Fade'

type Method = 'telegram' | 'viber' | 'sms'
interface ProfileExtra {
  notifyMethod : Method | null
  notifyValue  : string
  tgChatId?    : number
}

const METHODS = [
  { id: 'telegram', label: 'Telegram', icon: '/dashboard/icons/telegram.svg' },
  { id: 'viber',    label: 'Viber',    icon: '/dashboard/icons/viber.svg'    },
  { id: 'sms',      label: 'SMS',      icon: '/dashboard/icons/sms.svg'      },
] satisfies { id: Method; label: string; icon: string }[]

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

  /* --- UI --- */
  return (
    <div className="relative flex flex-col items-center gap-10">
      {/* header */}
      <header className="mt-4 text-center">
        <h1 className="mb-1 text-3xl font-bold">
          Оберіть спосіб сповіщення про стан заявок
        </h1>
        <p className="text-sm text-gray-500">
          На обраний месенджер ви будете отримувати сповіщення щодо зміни&nbsp;стану
        </p>
      </header>

      {/* picker */}
      <div className="flex gap-12">
        {METHODS.map(m => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`
              flex flex-col items-center gap-4 rounded-2xl p-6 transition
              ${method === m.id ? 'bg-[#dbe8ff] scale-105 shadow' : 'hover:bg-[#eef4ff]'}
            `}
          >
            <Image src={m.icon} alt="" width={120} height={120}/>
            <span className="text-xl font-semibold">{m.label}</span>
          </button>
        ))}
      </div>

      {/* input */}
      <div className="w-full max-w-md space-y-6">
        <label className="flex flex-col items-center gap-2 font-semibold">
          Вкажіть посилання чи номер телефону
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="https://t.me/…  або  +38 (067)…"
            className="
              w-full rounded-full border border-[#2C79FF]/60 px-6 py-2
              text-center outline-none focus:ring-2 focus:ring-[#2C79FF]
            "
          />
        </label>

        <div className="flex justify-center gap-6">
          <PrimaryButton
            onClick={handleLinkBot}
            disabled={linking || method !== 'telegram' || !!prof.tgChatId}
            className={method !== 'telegram' ? 'opacity-40 cursor-not-allowed' : ''}
          >
            {linking
              ? <span className="flex h-5 w-5 animate-spin border-2 border-white/40 border-t-white rounded-full" />
              : prof.tgChatId ? 'Бот підʼєднаний' : 'Підключити бота'}
          </PrimaryButton>

          <PrimaryButton onClick={save}>Зберегти</PrimaryButton>
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
            ">
            Збережено
          </button>
        </div>
      )}
      </Fade>
    </div>
  )
}
