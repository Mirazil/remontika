// src/app/dashboard/page.tsx

import PlusButton from "./PlusButton"
import RequestsList from "./RequestsList"
import "../globals.css"

export default function Dashboard() {
  return (
    <main className="px-4 py-8 max-w-7xl mx-auto">
      <RequestsList />
      <PlusButton />
    </main>
  )
}