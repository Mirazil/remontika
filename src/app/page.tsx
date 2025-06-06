/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import BenefitItem from '@/client/components/BenefitItem'
import ServiceItem from '@/client/components/ServiceItem'
import StatItem from '@/client/components/StatItem'
import RepairGallery from '@/client/components/RepairGallery'
import Step from '@/client/components/step'
import ReviewCarousel from '@/client/components/ReviewCarousel'
import FaqItem from '@/client/components/FaqItem';
import HeaderClientLoader from '@/client/components/HeaderClientLoader';
import ProfileButton from '@/client/components/ProfileButton'

export default function Home() {
  return (
    <>
      <HeaderClientLoader />
      <section
        id="hero"
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        {/* фон */}
        <div
          className="absolute inset-0 bg-[url('/images/main_bg.png')] bg-cover bg-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(255,255,255,0.8),_rgba(255,255,255,0)_55%)]" />

        {/* контент слева */}
        <div className="relative z-10 w-full lg:w-1/2 px-4 py-6 lg:px-32 lg:py-24">
          <h1 className="max-w-lg text-5xl font-bold leading-tight">
            <span className="block text-[#2C79FF]">Remontika</span>
            <span className="block text-[#303030]">
              Сервіс Ремонту Смартфонів
            </span>
          </h1>
          <p className="mt-4 max-w-md text-[#303030]">
            Відновимо та відремонтуємо ваш смартфон!
          </p>

          {/* иконки + кнопка */}
          <div className="mt-8 flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Image
                src="/images/low_price_img.png"
                alt=""
                width={52}
                height={52}
                className="h-12"
              />
              <span className="text-sm text-[#303030]">
                Найнижчі <br />
                ціни
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Image
                src="/images/good_comp_img.png"
                alt=""
                width={52}
                height={52}
                className="h-12"
              />
              <span className="text-sm text-[#303030]">
                Якісні <br />
                компоненти
              </span>
            </div>
          </div>

          {/* кнопка авторизации */}
          <div className="mt-8">
            <ProfileButton>Подати заявку</ProfileButton>
          </div>
        </div>
      </section>
      <section
        id="benefits"
        className="mx-auto max-w-7xl px-4 py-12 scroll-mt-24"
      >
        {/* заголовок */}
        <h2 className="mb-12 text-3xl font-extrabold text-[#303030]">
          Відновимо функціональність вашого смартфону!
        </h2>

        {/* сетка: 2 колонки (список) + карточка */}
        <div className="grid gap-12 lg:grid-cols-3">
          {/* ====== Список переваг ====== */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8">
            {/* 1 */}
            <BenefitItem
              icon="/images/benefits/delivery.png"
              text="Власна кур’єрська доставка смартфонів до сервісу"
            />

            {/* 2 */}
            <BenefitItem
              icon="/images/benefits/contract.png"
              text="Працюємо по договору з фіксованою ціною та чіткими термінами"
            />

            {/* 3 */}
            <BenefitItem
              icon="/images/benefits/warranty.png"
              text="Гарантія на всі ремонти — 12 місяців"
            />

            {/* 4 */}
            <BenefitItem
              icon="/images/benefits/chipset.png"
              text="Якісні комплектуючі від перевірених постачальників"
            />

            {/* 5 */}
            <BenefitItem
              icon="/images/benefits/any_repair.png"
              text="Ремонт будь-якої складності"
            />

            {/* 6 */}
            <BenefitItem
              icon="/images/benefits/low_price.png"
              text="Мінімальні ціни на ринку"
            />
          </div>

          {/* ====== Карточка справа ====== */}
          <aside className="flex items-center lg:justify-center">
            <div
              className="
                    w-full max-w-sm 
                    rounded-3xl bg-white p-8
                    shadow-[14px_4px_4px_rgba(0,0,0,0.1)]
                  "
            >
              <h3 className="text-xl font-bold text-[#303030] text-center mb-4">
                Потрібен ремонт?
              </h3>
              <p className="text-center text-sm text-text/80 mb-6">
                Створіть безкоштовний обліковий запис та залиште заявку!
              </p>

              {/* кнопка авторизации */}
              <div className="mt-8 flex justify-center">
                <ProfileButton>Подати заявку</ProfileButton>
              </div>
            </div>
          </aside>
        </div>
      </section>
      {/* === Секция "Що ми ремонтуємо?" === */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-24 ">
        <h2 className="text-3xl font-extrabold text-text text-center mb-8 ">
          Що ми ремонтуємо?
        </h2>

        {/* Белый контейнер с тенью ↓ */}
        <div className="bg-white rounded-3xl flex justify-center p-8 shadow-[14px_4px_4px_rgba(0,0,0,0.1)]">
          {/* Сетка 1/2/3 колонки */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
            <ServiceItem
              icon="/images/items/rep_smart.png"
              title="Ремонт мобільних телефонів"
            />
            <ServiceItem
              icon="/images/items/rep_talbets.png"
              title="Ремонт планшетів"
            />
            <ServiceItem
              icon="/images/items/rep_game_consoles.png"
              title="Ремонт ігрових консолей"
            />
            <ServiceItem
              icon="/images/items/rep_watch.png"
              title="Ремонт розумних годинників"
            />
            <ServiceItem
              icon="/images/items/rep_notebook.png"
              title="Ремонт ноутбуків"
            />
            <ServiceItem
              icon="/images/items/rep_pc.png"
              title="Ремонт комп’ютерів"
            />
          </div>
        </div>
      </section>
      <section id="numbers" className="mx-auto max-w-7xl px-4 py-4">
        <h2 className="text-3xl font-extrabold text-text text-center mb-12">
          Ми у цифрах:
        </h2>

        {/* сітка 3 × 2 */}
        <div className="grid gap-y-12 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
          <StatItem
            icon="/images/numbers/years.png"
            text="Неперервного досвіду у сфері ремонту смартфонів"
          />

          <StatItem
            icon="/images/numbers/service_points.png"
            text="3 сервісні пункти"
          />

          <StatItem
            icon="/images/numbers/galka.png"
            text="5000+ виконаних замовлень"
          />

          <StatItem
            icon="/images/numbers/service_worker.png"
            text="Майстри з досвідом понад 5 років"
          />

          <StatItem
            icon="/images/numbers/clock.png"
            text="У середньому 6 днів — тривалість ремонту навіть складних випадків"
          />

          <StatItem
            icon="/images/numbers/low_price_numbers.png"
            text="До 70 % вигідніше, ніж купівля нового смартфона"
          />
        </div>
      </section>
      <RepairGallery />

      <section id="process" className="mx-auto max-w-7xl px-4 py-24">
        <h2 className="mb-62 text-center text-3xl font-extrabold text-text">
          Як ми працюємо?
        </h2>

        {/* Блок-картка з майстром нагорі */}
        <div className="relative">
          {/* Майстер, “звисає” поверх картки */}
          <Image
            src="/images/process/worker_header.png"
            alt=""
            width={307}
            height={274}
            className="
                  absolute
                  left-1/2
                  top-0
                  -translate-x-1/2
                  -translate-y-6/7    /* вместо -1/2 ставим -3/4 (-75%) */
                  h-64
                  w-auto
                  select-none
                "
          />

          {/* Карточка */}
          <div className="mt-38 rounded-3xl bg-white p-12 shadow-[14px_4px_4px_rgba(0,0,0,0.1)]">
            {/* Сітка кроків */}
            <div className="relative flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
              {/* Пунктир між кружками */}
              <hr className="absolute top-[68px] left-[8.5rem] right-[8.5rem] hidden lg:block border-dashed border-text/30 z-0" />

              {/** пункт **/}
              <Step
                num="01"
                icon="/images/process/01_account.png"
                text="Ви створюєте обліковий запис"
              />
              <Step
                num="02"
                icon="/images/process/02_form.png"
                text="Заповнюєте заявку на ремонт"
              />
              <Step
                num="03"
                icon="/images/process/03_delivery.png"
                text="Кур’єр доставляє гаджет до сервісу"
              />
              <Step
                num="04"
                icon="/images/process/04_repair.png"
                text="Ми ремонтуємо"
              />
              <Step
                num="05"
                icon="/images/process/05_return.png"
                text="Доставка вашого гаджету до вас"
              />
            </div>

            {/* кнопка авторизации */}
            <div className="mt-8 flex justify-center">
              <ProfileButton>Подати заявку</ProfileButton>
            </div>
          </div>
        </div>
      </section>
      <ReviewCarousel />
      {/* src/app/page.tsx */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-24">
        <h2 className="mb-8 text-3xl flex justify-center font-extrabold text-text">
          FAQ
        </h2>

        {/* Обёртка: на мобильном – колонка, на md+ – две колонки */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Левая колонка */}
          <div className="flex-1 flex flex-col gap-6">
            {FAQ.filter((_, i) => i % 2 === 0).map((item) => (
              <FaqItem
                key={item.id}
                id={item.id}
                question={item.question}
                answer={item.answer}
                defaultOpen={item.defaultOpen}
              />
            ))}
          </div>

          {/* Правая колонка */}
          <div className="flex-1 flex flex-col gap-6">
            {FAQ.filter((_, i) => i % 2 === 1).map((item) => (
              <FaqItem
                key={item.id}
                id={item.id}
                question={item.question}
                answer={item.answer}
                defaultOpen={item.defaultOpen}
              />
            ))}
          </div>
        </div>
      </section>
      <section id="contacts" className="mx-auto max-w-7xl px-4 py-24">
  <h2 className="mb-8 flex justify-center text-3xl font-extrabold text-text">
    Контакти
  </h2>

  <div className="relative rounded-3xl overflow-visible shadow-[14px_4px_4px_rgba(0,0,0,0.1)]">
    {/* Оверлей с контактами: на мобильных — статично, центр, с отступом снизу; начиная с md — абсолютное позиционирование */}
    <div
      className="
        w-72 bg-white rounded-2xl p-6 shadow-lg z-10
        mx-auto mb-4
        md:absolute md:-top-12 md:-left-12 md:mx-0 md:mb-0
      "
    >
      <h3 className="mb-4 flex justify-center text-xl font-bold text-text">
        Контакти
      </h3>
      <ul className="space-y-3">
        <li className="flex items-center gap-2">
          <Image
            src="/icons/phone.svg"
            alt="phone"
            width={27}
            height={27}
            className="h-6 w-6 rounded-full bg-[#2C79FF] p-1"
          />
          <span>+38 (096) 444-44-44</span>
        </li>
        <li className="flex items-center gap-2">
          <Image
            src="/icons/location.svg"
            alt="location"
            width={30}
            height={30}
            className="h-6 w-6 rounded-full bg-[#2C79FF] p-1"
          />
          <span>м.Київ, вул.Солом’янська 7, ДУІКТ</span>
        </li>
        <li className="flex items-center gap-2">
          <Image
            src="/icons/mail.svg"
            alt="mail"
            width={30}
            height={24}
            className="h-6 w-6 rounded-full bg-[#2C79FF] p-1"
          />
          <span>oleg@gmail.com</span>
        </li>
      </ul>

      <h4 className="mt-6 mb-2 flex justify-center text-lg font-semibold text-text">
        Соц. Медіа
      </h4>
      <div className="flex justify-center items-center gap-4">
        <a
          href="https://t.me/RemontikaBot"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/telegram.svg"
            alt="Telegram"
            width={38}
            height={38}
            className="h-6 w-6"
          />
        </a>
        <a
          href="viber://chat?number=%2B380964444444"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/viber.svg"
            alt="Viber"
            width={38}
            height={38}
            className="h-6 w-6"
          />
        </a>
      </div>
    </div>

    {/* Кликабельная карта: при мобильном экране под карточкой, на десктопе остаётся на месте */}
    <a
      href="https://www.google.com/maps/place/Державний+університет+інформаційно-комунікаційних+технологій+(ДУІКТ)/@50.4292635,30.4738532,17z"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/images/map_screenshot.png"
        alt="Map to ДУІКТ"
        width={1104}
        height={700}
        className="block w-full h-auto object-cover"
      />
    </a>
  </div>
</section>


      <footer className="bg-[#303030] text-white">
        <div className="mx-auto max-w-7xl px-4 py-2">
          {/* Используем flex-контейнер, который на мобильных располагает
          элементы вертикально, а на md+ (>=768px) — горизонтально. */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            {/* 1) Логотип + подпись */}
            <a
              href="#hero"
              className="flex flex-col items-center"
            >
              <Image
                src="/images/remontika_logo.svg"
                alt="Remontika"
                width={74}
                height={86}
                className="h-12 w-auto select-none"
              />
              <span className="mt-2 text-sm text-[#2C79FF] font-semibold">
                Remontika
              </span>
            </a>

            {/* 2) Навигация сайта */}
            <nav className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="#benefits" className="hover:text-[#2C79FF]">Про нас</a>
              <a href="#services" className="hover:text-[#2C79FF]">Перелік ремонту</a>
              <a href="#works" className="hover:text-[#2C79FF]">Приклад робіт</a>
              <a href="#reviews" className="hover:text-[#2C79FF]">Відгуки</a>
              <a href="#contacts" className="hover:text-[#2C79FF]">Контакти</a>
            </nav>

            {/* 3) Основной текст футера */}
            <p className="text-center text-sm leading-snug md:text-right">
              Дипломна робота студента Державного університету
              <br className="block md:hidden" />{" "}
              {/* переносим, чтобы на мобильном была аккуратно */}
              інформаційно-комунікаційних технологій
              <br className="block md:hidden" />{" "}
              {/* условный перенос на смартфонах */}
              Чудакова Олега Сергійовича ІСД-42
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

const FAQ = [
  {
    id: 1,
    question: 'Обов’язково приносити смартфон у сервісний центр?',
    answer:
      'Так, для якісного ремонту потрібне спеціалізоване обладнання, яке неможливо використовувати вдома. Ви можете самостійно принести пристрій або скористатися нашою кур’єрською доставкою.',
    defaultOpen: true,
  },
  {
    id: 2,
    question: 'Який термін виконання ремонту?',
    answer:
      'Ми прагнемо відремонтувати ваш пристрій якомога швидше. В середньому термін ремонту складає від 3 до 7 днів, залежно від складності несправності.',
  },
  {
    id: 3,
    question: 'Яка вартість ремонту смартфона?',
    answer:
      'Вартість ремонту залежить від типу несправності та необхідних запчастин. Ми пропонуємо прозорі ціни і надаємо детальний кошторис перед початком робіт, щоб ви знали, за що платите.',
    defaultOpen: true,
  },
  {
    id: 4,
    question: 'Чи можна замовити заміну тільки окремої деталі?',
    answer:
      'Так, ми виконуємо заміну окремих деталей вашого пристрою. Якщо потрібно, ми можемо встановити лише необхідну запчастину, що дозволяє зекономити ваш час та гроші.',
    defaultOpen: true,
  },
  {
    id: 5,
    question: 'Ви встановлюєте запчастини, якщо вони мої?',
    answer:
      'Ми можемо встановити ваші власні комплектуючі, але рекомендуємо використовувати наші перевірені запчастини для гарантії якості.',
  },
  {
    id: 6,
    question: 'Як відбувається оплата за ремонт?',
    answer:
      'Після узгодження вартості оформлюється договір. Оплата здійснюється частково авансом і остаточно після завершення ремонту та перевірки пристрою.',
    defaultOpen: true,
  },
  {
    id: 7,
    question: 'Чи є гарантія на ремонт смартфона?',
    answer:
      'Так, ми надаємо офіційну гарантію на всі види ремонтних робіт терміном до 12 місяців. Ви можете бути впевнені в якості виконаного сервісу!',
  },
]



