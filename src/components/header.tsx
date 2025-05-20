/* eslint-disable @next/next/no-img-element */
// import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <img
          src="/images/remontika_logo.svg"
          alt="Remontika"
          className="h-15 w-auto select-none"
        />
        <nav className="flex-1 hidden lg:flex justify-center gap-14  text-[#303030] text-sm font-light">
          <a href="#about">Про нас</a>
          <a href="#services">Перелік ремонту</a>
          <a href="#works">Приклад робіт</a>
          <a href="#reviews">Відгуки</a>
          <a href="#contacts">Контакти</a>
        </nav>
        <button className="ml-auto flex h-9 w-9 items-center justify-center rounded-full ">
          <img
            src="/images/my_account_button.svg"
            alt="my account"
            className="h-15 w-auto"
          />
        </button>
      </div>
    </header>
  );
}
