import { NextResponse } from "next/server"
import { sendSpiritSpaBulkEmail } from "@/lib/db"
import { sendSpiritSpaWelcomeEmail } from "@/lib/email"
import { getSessionUser } from "@/lib/session"

export async function POST() {
  const sessionUser = await getSessionUser()
  if (!sessionUser || sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await sendSpiritSpaBulkEmail("spirit-spa", sendSpiritSpaWelcomeEmail)
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Failed to send Spirit Spa emails:", error)
    return NextResponse.json({ error: "Failed to send emails." }, { status: 500 })
  }
}
