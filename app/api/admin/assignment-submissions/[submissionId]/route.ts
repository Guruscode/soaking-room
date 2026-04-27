import { NextResponse } from "next/server"
import { reviewAssignmentSubmission } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { AssignmentSubmissionReviewPayload } from "@/lib/types"

type RouteContext = {
  params: Promise<{
    submissionId: string
  }>
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const admin = await requireAdminSession()
    const { submissionId } = await context.params
    const payload = (await request.json()) as AssignmentSubmissionReviewPayload

    return NextResponse.json({
      data: await reviewAssignmentSubmission(submissionId, admin.fullName, payload),
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
