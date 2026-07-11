import { NextResponse } from "next/server"
import { getExamConfig, getExamQuestions, listExamSubmissions, pushExamResults } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

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

export async function POST() {
  try {
    await requireAdminSession()
    const result = await pushExamResults()
    return NextResponse.json({ data: result })
  } catch (error) {
    return handleRouteError(error)
  }
}
