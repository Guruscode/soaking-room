import { NextResponse } from "next/server"
import { AppError, getErrorMessage } from "@/lib/errors"
import { verifyRegistrationOtp } from "@/lib/db"
import { createSessionToken, setSessionCookie } from "@/lib/session"
import type { RegistrationOtpVerifyPayload } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RegistrationOtpVerifyPayload
    const user = await verifyRegistrationOtp(payload)

    await setSessionCookie(
      createSessionToken({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        admissionStatus: user.admissionStatus,
      }),
    )

    return NextResponse.json({
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        admissionStatus: user.admissionStatus,
      },
    })
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: getErrorMessage(error) }, { status })
  }
}
