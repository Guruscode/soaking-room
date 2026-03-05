import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StudentNextClassPage() {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Next Class</h2>
      <p className="text-sm text-slate-300">Friday, 6 March 2026 | 6:00pm - 8:00pm WAT</p>
      <p className="text-sm text-slate-300">Focus: Prophetic Worship Session + Spiritual Formation</p>
      <Button asChild className="rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300">
        <Link href="https://meet.google.com" target="_blank" rel="noopener noreferrer">
          Join Class Link
        </Link>
      </Button>
    </div>
  )
}
