/* eslint-disable @next/next/no-img-element */
import Header from '@/components/header'
import HeroCTA from '@/components/HeroCTA'
import BenefitItem from '@/components/BenefitItem'
import ServiceItem from '@/components/ServiceItem'
import StatItem from '@/components/StatItem'
import RepairGallery from '@/components/RepairGallery'
import Step from '@/components/step'
import ReviewCarousel from '@/components/ReviewCarousel'
import FaqItem from '@/components/FaqItem';

export default function Home() {
  return (
    <>
      <Header />
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
        <div className="relative z-10 w-full lg:w-1/2 px-32 py-24">
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
              <img src="/images/low_price_img.png" alt="" className="h-12" />
              <span className="text-sm text-[#303030]">
                Найнижчі <br />
                ціни
              </span>
            </div>
            <div className="flex items-center gap-4">
              <img src="/images/good_comp_img.png" alt="" className="h-12" />
              <span className="text-sm text-[#303030]">
                Якісні <br />
                компоненти
              </span>
            </div>
          </div>

          {/* кнопка */}
          <div className="mt-8">
            <HeroCTA />
          </div>
        </div>
      </section>
      <section id="benefits" className="mx-auto max-w-7xl px-4 py-12 scroll-mt-24">
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

              {/* кнопка */}
              <div className="mt-8 flex justify-center">
                <HeroCTA />
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
          <img
            src="/images/process/worker_header.png"
            alt=""
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

            {/* кнопка під схемою */}
            <div className="mt-12 flex justify-center">
              <HeroCTA />
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

        {/* Обёртка для позиционирования */}
        <div className="relative rounded-3xl overflow-visible shadow-[14px_4px_4px_rgba(0,0,0,0.1)]">
          {/* Оверлей с контактами */}
          <div
            className="
        absolute -top-12 -left-12
        w-72  /* ширина блока с контактами */
        bg-white rounded-2xl p-6
        shadow-lg
        z-10
      "
          >
            <h3 className="mb-4 flex justify-center text-xl font-bold text-text">
              Контакти
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <img
                  src="/icons/phone.svg"
                  alt="phone"
                  className="h-6 w-6 rounded-full bg-[#2C79FF] p-1"
                />
                <span>+38 (096) 444-44-44</span>
              </li>
              <li className="flex items-center gap-2">
                <img
                  src="/icons/location.svg"
                  alt="location"
                  className="h-6 w-6 rounded-full bg-[#2C79FF] p-1"
                />
                <span>м.Київ, вул.Солом’янська 7, ДУІКТ</span>
              </li>
              <li className="flex items-center gap-2">
                <img
                  src="/icons/mail.svg"
                  alt="mail"
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
                <img
                  src="/icons/telegram.svg"
                  alt="Telegram"
                  className="h-6 w-6"
                />
              </a>
              <a
                href="viber://chat?number=%2B380964444444"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/viber.svg" alt="Viber" className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Кликабельныая карта */}
          <a
            href="https://www.google.com/maps/place/Державний+університет+інформаційно-комунікаційних+технологій+(ДУІКТ)/@50.4292635,30.4738532,17z"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/map_screenshot.png"
              alt="Map to ДУІКТ"
              className="block w-full h-auto object-cover"
            />
          </a>
        </div>
      </section>
      <footer className="bg-[#303030] text-white ">
        <div className="relative mx-auto max-w-7xl px-4 py-8">
          {/* Абсолютный контейнер: иконка сверху, текст снизу, всё вместе */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
            <img
              src="/images/remontika_logo.svg"
              alt="Remontika"
              className="h-12 mb-0 w-auto select-none"
            />
            <span className="mt-0 text-sm text-[#2C79FF] font-semibold">Remontika</span>
          </div>

          {/* 2) Текст по центру */}
          <p className="text-center text-sm">
            Дипломна робота студента Державного університету
            інформаційно-комунікаційних технологій Чудакова Олега Сергійовича
            ІСД-42
          </p>
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



