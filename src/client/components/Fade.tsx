// components/Fade.tsx
'use client';

import { useState, useEffect, ReactNode, FC } from 'react';

interface FadeProps {
  /** Показывать (true) или скрывать (false) */
  show: boolean;
  /** Длительность анимации в миллисекундах (по умолчанию 250) */
  duration?: number;
  /** Колбэк после завершения FADE-OUT (когда opacity дошло до 0 и элемент убирается из DOM) */
  onFadeOutComplete?: () => void;
  children: ReactNode;
}

const Fade: FC<FadeProps> = ({
  show,
  duration = 250,
  onFadeOutComplete,
  children,
}) => {
  // shouldRender = true, когда нужно вообще отрисовать блок
  const [shouldRender, setShouldRender] = useState(show);
  // isVisible = false по умолчанию — чтобы на старте был opacity: 0
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Когда show становится true → сначала помещаем блок в DOM
      setShouldRender(true);
      // Затем, в следующий тик браузера, делаем isVisible=true → CSS-переход opacity 0→1
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // Когда show становится false → делаем isVisible=false → CSS-переход opacity 1→0
      setIsVisible(false);
      // По истечении duration мс убираем блок из DOM и вызываем onFadeOutComplete
      const timeoutId = setTimeout(() => {
        setShouldRender(false);
        onFadeOutComplete?.();
      }, duration);

      return () => clearTimeout(timeoutId);
    }
  }, [show, duration, onFadeOutComplete]);

  // Если shouldRender=false, не рендерим детей вовсе
  if (!shouldRender) {
    return null;
  }

  // Иначе отрисовываем блок с inline-стилями для плавного перехода
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}ms ease-in-out`,
      }}
    >
      {children}
    </div>
  );
};

export default Fade;
