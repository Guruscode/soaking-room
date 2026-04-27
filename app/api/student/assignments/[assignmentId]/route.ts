import { NextResponse } from "next/server"
import { submitAssignmentForStudent } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"
import type { AssignmentSubmissionPayload } from "@/lib/types"

type RouteContext = {
  params: Promise<{
    assignmentId: string
  }>
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const student = await requireStudentSession()
    const { assignmentId } = await context.params
    const payload = (await request.json()) as AssignmentSubmissionPayload

    return NextResponse.json({
      data: await submitAssignmentForStudent(student.id, assignmentId, payload),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
