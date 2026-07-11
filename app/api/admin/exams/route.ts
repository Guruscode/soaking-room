import { NextResponse } from "next/server"
import { getExamConfig, getExamQuestions, listExamSubmissions, updateExamConfig } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { ExamConfigPayload } from "@/lib/types"

export async function GET() {
  try {
    const admin = await requireAdminSession()
    const [config, questions, submissions] = await Promise.all([
      getExamConfig(),
      getExamQuestions(),
      listExamSubmissions(),
    ])

    return NextResponse.json({ data: { config, questions, submissions, adminName: admin.fullName } })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdminSession()
    const payload = (await request.json()) as ({ status?: "active" | "inactive" } & Partial<ExamConfigPayload>)
    const config = await updateExamConfig(payload)
    return NextResponse.json({ data: config })
  } catch (error) {
    return handleRouteError(error)
  }
}
