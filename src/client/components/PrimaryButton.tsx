'use client'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function PrimaryButton({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={
        `relative inline-block rounded-[22px] bg-[#2C79FF] px-12 py-4 text-white font-semibold
         transition-transform duration-150 active:translate-y-[3px] ${className}`
      }
    >
      <span className="relative z-10">{children}</span>
      {/* тень */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[22px] bg-primaryDark translate-y-[6px]"
      />
    </button>
  )
}
