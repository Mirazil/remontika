// src/app/dashboard/all/page.tsx
'use client'
import RequestsList from '../RequestsList'

export default function AllRequestsPage() {
  return (
    <main className="px-4 py-8 max-w-7xl mx-auto">
      <RequestsList />    {/* без limit → полный список с пагинацией */}
    </main>
  )
}
