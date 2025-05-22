/* ───────── src/components/Spinner.tsx ───────── */
export default function Spinner () {
  return (
    <div className="flex justify-center pt-20">
      <svg className="h-6 w-6 animate-spin text-[#2C79FF]" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"
                className="stroke-current stroke-2 opacity-25" fill="none" />
        <path  d="M22 12a10 10 0 0 1-10 10"
               className="stroke-current stroke-2 opacity-75" fill="none" />
      </svg>
    </div>
  )
}
