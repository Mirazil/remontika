/* ───────── src/app/not-found.tsx ───────── */
import Link from 'next/link'

export const metadata = {        // ✅ чтобы в заголовке вкладки был красивый title
  title: 'Сторінку не знайдено – 404',
}

export default function NotFound() {
  return (
    <main className="
      flex min-h-screen flex-col items-center justify-center gap-10
      bg-[#f7f7f7] px-4 text-center text-text
    ">
      {/* логотип */}
      <img
        src="/images/remontika_logo.svg"
        alt="Remontika"
        className="h-28 select-none"
      />

      {/* заголовок + подпись */}
      <div>
        <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
        <p className="mt-2 text-xl sm:text-2xl opacity-80">
          На жаль, такої сторінки не існує&nbsp;…
        </p>
      </div>

      {/* кнопка «На головну» */}
      <Link
        href="/"
        className="
          inline-block rounded-full border-2 border-[#2C79FF] bg-white px-10 py-4
          font-semibold text-[#303030] shadow-[0_4px_4px_rgba(44,121,255,0.4)]
          transition hover:-translate-y-[2px] hover:shadow-lg
          active:translate-y-[3px]
        "
      >
        Повернутись на головну
      </Link>
    </main>
  )
}
