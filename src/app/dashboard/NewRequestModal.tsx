// src/app/(dashboard)/NewRequestModal.tsx
'use client'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'          // ←  ваша инициализация
import { getAuth } from 'firebase/auth'
import type { NewRequest, DeviceType } from '@/types/request'
import Step1SelectDevice from './steps/Step1SelectDevice'
import Step2DeviceInfo from './steps/Step2DeviceInfo'
import Step3ContactChoose from './steps/Step3ContactChoose'
import Step4ContactFill from './steps/Step4ContactFill'
import Step5Address from './steps/Step5Address'
import Step6Summary from './steps/Step6Summary'

type Props = { onClose: () => void }

const EMPTY: NewRequest = {
  step: 1,
  device: null,
  brand: '',
  model: '',
  description: '',
  photos: [],
  contactMethod: null,
  contactValue: '',
  address: '',
  selfDelivery: false,
}

export default function NewRequestModal({ onClose }: Props) {
  const [data, setData] = useState<NewRequest>(EMPTY)
  const [loading, setLoading] = useState(false)

  /* ---------- helpers ---------- */
  const next = () => setData((d) => ({ ...d, step: d.step + 1 }))
  const back = () => setData((d) => ({ ...d, step: d.step - 1 }))

  /* ---------- финальная отправка ---------- */
const submit = async () => {
  try {
    setLoading(true)

    /* ---------- 1. user id ---------- */
    const uid = getAuth().currentUser?.uid
    if (!uid) throw new Error('Користувач не авторизований')

    /* ---------- 2. upload photo ---------- */
    const photoUrls: string[] = []
    for (const f of data.photos) {
      const fileRef = sRef(storage, `requests/${uid}/${Date.now()}-${f.name}`)
      await uploadBytes(fileRef, f)
      photoUrls.push(await getDownloadURL(fileRef))
    }

    /* ---------- 3. write doc ---------- */
    await addDoc(collection(db, 'requests'), {
      userId: uid,                       // ← обов’язково!
      device:        data.device,
      brand:         data.brand,
      model:         data.model,
      description:   data.description,
      photos:        photoUrls,
      contactMethod: data.contactMethod,
      contactValue:  data.contactValue,
      address:       data.selfDelivery ? 'self' : data.address,
      status:        'pending',

      createdAt:  serverTimestamp(),
    })

    onClose()
  } catch (e) {
    console.error(e)
    alert('Не вдалося створити заявку')
  } finally {
    setLoading(false)
  }
}

  /* ---------- отрисовка этапов ---------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-[720px] max-w-full rounded-3xl border-2 border-[#2C79FF] bg-white p-8">
        {/* крестик */}
        <button className="absolute top-4 right-4 text-[#2C79FF]" onClick={onClose}>
          <X />
        </button>

        {/* шапка (строка заголовка из макета) */}
        <h3 className="mb-4 text-lg italic text-text/70 border-b border-[#2C79FF] pb-2">
          Звернення #1 – 
          {data.brand && `${data.brand} ${data.model}, `}{data.description.slice(0, 30)}
        </h3>

        {data.step === 1 && (
          <Step1SelectDevice data={data} setData={setData} next={next} />
        )}

        {data.step === 2 && (
          <Step2DeviceInfo data={data} setData={setData} next={next} back={back} />
        )}

        {data.step === 3 && (
          <Step3ContactChoose data={data} setData={setData} next={next} back={back} />
        )}

        {data.step === 4 && (
          <Step4ContactFill data={data} setData={setData} next={next} back={back} />
        )}

        {data.step === 5 && (
          <Step5Address data={data} setData={setData} next={next} back={back} />
        )}

        {data.step === 6 && (
          <Step6Summary data={data} submit={submit} back={back} loading={loading} />
        )}

        {/* індикатор сторінок (прибираємо дублювання для 6-го кроку) */}
        {data.step !== 6 && (
          <p className="mt-6 text-center font-semibold">
            {data.step} / 6
          </p>
        )}
      </div>
    </div>
  )
}
