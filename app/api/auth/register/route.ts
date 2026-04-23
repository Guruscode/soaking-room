import { NextResponse } from "next/server"
import { TSR_ACADEMY_ADMISSION_STATUS } from "@/lib/academy-admissions"
import { AppError, getErrorMessage } from "@/lib/errors"
import { requestRegistrationOtp } from "@/lib/db"
import type { RegisterPayload } from "@/lib/types"

export async function POST(request: Request) {
  try {
    if (!TSR_ACADEMY_ADMISSION_STATUS.isOpen) {
      throw new AppError(TSR_ACADEMY_ADMISSION_STATUS.closedNotice, 403)
    }

    const payload = (await request.json()) as RegisterPayload
    return NextResponse.json({ data: await requestRegistrationOtp(payload) })
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: getErrorMessage(error) }, { status })
  }
}
