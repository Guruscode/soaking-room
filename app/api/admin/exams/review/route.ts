import { NextResponse } from "next/server"
import { reviewExamAnswer } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

export async function POST(request: Request) {
  try {
    const admin = await requireAdminSession()

    const payload = (await request.json()) as { answerId: string; score: number | null }
    const result = await reviewExamAnswer(payload.answerId, payload.score, admin.fullName)

    return NextResponse.json({ data: result })
  } catch (error) {
    return handleRouteError(error)
  }
}
