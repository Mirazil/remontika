/* ───────── src/app/dashboard/admin/completed/DoneRequestCard.tsx ───────── */
'use client'

import clsx           from 'clsx'
import type { DoneDoc } from './page'

export default function DoneRequestCard (d: DoneDoc) {
  return (
    <article
      className={clsx(
        'rounded-full border-2 border-green-500/70 bg-green-50/40',
        'px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-8'
      )}
    >
      {/* левая (текст) колонка */}
      <div className="flex-1 ml-8 space-y-1">
        <h3 className="font-semibold">Ремонт #{d.id.slice(-4)}</h3>

        <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            <p>
              <b>Марка:</b> {d.brand}
              <p>
                <b>Модель:</b> {d.model}
              </p>
            </p>
            <p>
              <b>Коментарі:</b> {d.description || "—"}
            </p>
            <p>
              <b>Адреса:</b> {d.address === "self" ? "Доставлю сам" : d.address}
            </p>
        </div>

        <p className="text-sm italic text-gray-600">
          {d.contactMethod}, {d.contactValue}
        </p>
      </div>

      {/* дата справа */}
      <time className="shrink-0 text-sm mr-8 text-gray-500 mt-auto sm:mt-1">
        {d.createdAt?.toDate().toLocaleString('uk-UA', {
          day:    '2-digit',
          month:  '2-digit',
          year:   'numeric',
          hour:   '2-digit',
          minute: '2-digit',
        })}
      </time>
    </article>
  )
}
