/* ───────── src/app/(dashboard)/notifications/page.tsx ───────── */
'use client'

import { useEffect, useState }               from 'react'
import { getAuth }                           from 'firebase/auth'
import { doc, onSnapshot, setDoc }           from 'firebase/firestore'
import { db }                                from '@/lib/firebase'
import Image                                 from 'next/image'
import Spinner                               from '@/components/Spinner'
import PrimaryButton                         from '@/components/PrimaryButton'

type Method = 'telegram' | 'viber' | 'sms'
interface ProfileExtra { notifyMethod: Method|null; notifyValue: string }

const METHODS: { id:Method; label:string; icon:string }[] = [
  { id:'telegram', label:'Telegram', icon:'/dashboard/icons/telegram.svg' },
  { id:'viber',    label:'Viber',    icon:'/dashboard/icons/viber.svg'    },
  { id:'sms',      label:'SMS',      icon:'/dashboard/icons/sms.svg'      },
]

export default function NotificationsPage () {
  /* ---------- користувач ---------- */
  const user = getAuth().currentUser
  if (!user) return <p className="p-8 text-center">Ви не авторизовані 🙃</p>

  /* ---------- профіль з Firestore ---------- */
  const [prof, setProf] = useState<ProfileExtra>()

  useEffect(() => {
    const ref = doc(db,'users',user.uid)
    return onSnapshot(ref,snap=>{
      if (snap.exists()) setProf(snap.data() as any)
      else {                             // перший вхід – порожній шаблон
        setDoc(ref,{notifyMethod:null,notifyValue:''})
        setProf({notifyMethod:null,notifyValue:''})
      }
    })
  },[])

  /* ---------- локальний стейт форми ---------- */
  /*  !! оголошуємо ДО return, щоб кількість хуків не мінялась  */
  const [method, setMethod] = useState<Method|null>(null)
  const [value , setValue ] = useState('')

  /* коли профіль підтягнувся – заповнюємо інпути */
  useEffect(()=>{
    if (prof){
      setMethod(prof.notifyMethod)
      setValue (prof.notifyValue )
    }
  },[prof])

  if (!prof) return <Spinner/>

  /* ---------- збереження ---------- */
  const save = async()=>{
    if (!method || !value.trim()){
      alert('Оберіть спосіб та вкажіть посилання / номер')
      return
    }
    await setDoc(doc(db,'users',user.uid),
                 {notifyMethod:method, notifyValue:value.trim()},
                 {merge:true})
    alert('Збережено ✅')
  }

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col items-center gap-10">

      <header className="mt-4 text-center">
        <h1 className="text-3xl font-bold mb-1">
          Оберіть спосіб сповіщення про стан заявок
        </h1>
        <p className="text-gray-500 text-sm">
          На обраний месенджер ви будете отримувати сповіщення щодо зміни стану заявок
        </p>
      </header>

      {/* вибір месенджера */}
      <div className="flex gap-12">
        {METHODS.map(m=>(
          <button key={m.id}
                  onClick={()=>setMethod(m.id)}
                  className={`
                    flex flex-col items-center gap-4 rounded-2xl p-6 transition
                    ${method===m.id
                      ? 'bg-[#dbe8ff] scale-105 shadow'
                      : 'hover:bg-[#eef4ff]'}
                  `}
          >
            <Image src={m.icon} alt="" width={120} height={120}/>
            <span className="text-xl font-semibold">{m.label}</span>
          </button>
        ))}
      </div>

      {/* поле вводу */}
      <div className="w-full max-w-md space-y-6">
        <label className="flex flex-col gap-2 font-semibold items-center">
          Вкажіть посилання чи номер телефону
          <input
            className="w-full rounded-full border border-[#2C79FF]/60 px-6 py-2
                       text-center outline-none focus:ring-2 focus:ring-[#2C79FF]"
            value={value}
            onChange={e=>setValue(e.target.value)}
            placeholder="https://t.me/…  або  +38 (067)…"
          />
        </label>

        <div className="flex justify-center">
          <PrimaryButton onClick={save}>Зберегти</PrimaryButton>
        </div>
      </div>

    </div>
  )
}
