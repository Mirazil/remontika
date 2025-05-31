// src/types/request.ts
export type DeviceType = 'phone' | 'tablet' | 'console' | 'watch' | 'laptop' | 'pc';
export type ContactMethod = 'telegram' | 'viber' | 'sms';


export interface NewRequest {
  step: number
  device: DeviceType | null
  brand: string
  model: string
  description: string
  photos: File[]        // локальные файлы
  contactMethod: 'telegram' | 'viber' | 'sms' | null
  contactValue: string
  address: string
  selfDelivery: boolean
}
