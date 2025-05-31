// src/client/components/HeaderClientLoader.tsx
'use client';

import dynamic from 'next/dynamic';

// Динамически грузим сам Header (который уже тоже client component)
const Header = dynamic(() => import('@/client/components/header'), {
  ssr: false,
});

export default function HeaderClientLoader() {
  // Просто рендерим динамический Header
  return <Header />;
}