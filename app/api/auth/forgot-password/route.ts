import { NextResponse } from "next/server"
import { AppError, getErrorMessage } from "@/lib/errors"
import { requestPasswordResetOtp } from "@/lib/db"
import type { PasswordResetOtpRequestPayload } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as PasswordResetOtpRequestPayload
    return NextResponse.json({ data: await requestPasswordResetOtp(payload) })
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: getErrorMessage(error) }, { status })
  }
}
