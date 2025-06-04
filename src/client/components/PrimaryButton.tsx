'use client'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
    size?: 'sm' | 'md'
}

export default function PrimaryButton({
  children,
  className = '',
  size = 'md',
  ...rest
}: ButtonProps) {
  const sizeClasses =
    size === 'sm'
      ? 'px-6 py-2'
      : 'px-12 py-4'
  const shadowClasses = size === 'sm' ? 'translate-y-[3px]' : 'translate-y-[6px]'
  return (
    <button
      {...rest}
      className={`relative inline-block rounded-[22px] bg-[#2C79FF] text-white font-semibold whitespace-nowrap transition-transform duration-150 active:translate-y-[3px] ${sizeClasses} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {/* тень */}
      <span aria-hidden className={`absolute inset-0 rounded-[22px] bg-primaryDark ${shadowClasses}`} />
    </button>
  )
}
