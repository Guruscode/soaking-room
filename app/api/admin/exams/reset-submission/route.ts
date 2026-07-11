import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

export async function POST(request: Request) {
  try {
    await requireAdminSession()

    const payload = (await request.json()) as { answerId: string }

    if (!payload.answerId) {
      return NextResponse.json({ error: "Answer ID is required." }, { status: 400 })
    }

    await turso.execute({
      sql: `
        UPDATE exam_answers
        SET is_submitted = 0, submitted_at = NULL, score = NULL, reviewed_at = NULL, reviewed_by = NULL, results_notified = 0, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND is_submitted = 1
      `,
      args: [payload.answerId],
    })

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    return handleRouteError(error)
  }
}
