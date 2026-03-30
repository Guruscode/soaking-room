import { NextResponse } from "next/server"
import { getAcademyUser } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export async function GET() {
  const sessionUser = await getSessionUser()

  if (!sessionUser) {
    return NextResponse.json({ data: null })
  }

  const user = await getAcademyUser(sessionUser.id)

  if (!user) {
    return NextResponse.json({ data: null })
  }

  return NextResponse.json({
    data: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      admissionStatus: user.admissionStatus,
    },
  })
}
