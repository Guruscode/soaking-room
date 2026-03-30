import { NextResponse } from "next/server"
import { AppError, getErrorMessage } from "@/lib/errors"
import { getAcademyUser } from "@/lib/db"
import { getSessionUser } from "@/lib/session"

export async function requireAdminSession() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "admin") {
    throw new AppError("Unauthorized.", 401)
  }

  return sessionUser
}

export async function requireStudentSession() {
  const sessionUser = await getSessionUser()

  if (!sessionUser || sessionUser.role !== "student") {
    throw new AppError("Unauthorized.", 401)
  }

  const user = await getAcademyUser(sessionUser.id)

  if (!user) {
    throw new AppError("User not found.", 404)
  }

  return user
}

export function handleRouteError(error: unknown) {
  const status = error instanceof AppError ? error.statusCode : 500
  return NextResponse.json({ error: getErrorMessage(error) }, { status })
}
