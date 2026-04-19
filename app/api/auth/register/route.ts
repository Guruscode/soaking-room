import { NextResponse } from "next/server"
import { AppError, getErrorMessage } from "@/lib/errors"
import { requestRegistrationOtp } from "@/lib/db"
import type { RegisterPayload } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RegisterPayload
    return NextResponse.json({ data: await requestRegistrationOtp(payload) })
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: getErrorMessage(error) }, { status })
  }
}
