
import Header from '@/components/header'
import HeroCTA from '@/components/HeroCTA';

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
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/10 to-transparent" />

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
              <span className="text-sm text-[#303030]">Найнижчі <br />ціни</span>
            </div>
            <div className="flex items-center gap-4">
              <img src="/images/good_comp_img.png" alt="" className="h-12" />
              <span className="text-sm text-[#303030]">Якісні <br />компоненти</span>
            </div>
          </div>

          {/* кнопка */}
          <div className="mt-8">
            <HeroCTA />
          </div>
        </div>
      </section>
    </>
  );
}
