import type { Metadata } from "next"
import { MaintenanceContent } from "./maintenance-content"

export const metadata: Metadata = {
  title: "Under Maintenance - The Soaking Room",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return <MaintenanceContent />
}
