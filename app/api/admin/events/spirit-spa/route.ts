import { NextResponse } from "next/server"
import { listEventRegistrations } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export async function GET() {
  const sessionUser = await getSessionUser()
  if (!sessionUser || sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const registrations = await listEventRegistrations("spirit-spa")
    return NextResponse.json({ data: registrations })
  } catch (error) {
    console.error("Failed to list event registrations:", error)
    return NextResponse.json({ error: "Failed to load registrations." }, { status: 500 })
  }
}
