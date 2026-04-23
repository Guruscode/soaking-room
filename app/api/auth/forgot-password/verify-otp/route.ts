import { NextResponse } from "next/server"
import { AppError, getErrorMessage } from "@/lib/errors"
import { resetPasswordWithOtp } from "@/lib/db"
import type { PasswordResetOtpVerifyPayload } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as PasswordResetOtpVerifyPayload
    return NextResponse.json({ data: await resetPasswordWithOtp(payload) })
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: getErrorMessage(error) }, { status })
  }
}
