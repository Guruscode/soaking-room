import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { env } from "@/lib/env"

export const SESSION_COOKIE_NAME = "tsr_session"

export type SessionUser = {
  id: string
  email: string
  fullName: string
  role: "student" | "admin"
  admissionStatus: "pending" | "approved" | "rejected"
}

type SessionPayload = SessionUser & {
  exp: number
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString("base64url")
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(value: string) {
  return createHmac("sha256", env.sessionSecret).update(value).digest("base64url")
}

export function createSessionToken(user: SessionUser) {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }

  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const signature = sign(encodedPayload)
  return `${encodedPayload}.${signature}`
}

export function verifySessionToken(token: string): SessionUser | null {
  const [encodedPayload, receivedSignature] = token.split(".")

  if (!encodedPayload || !receivedSignature) {
    return null
  }

  const expectedSignature = sign(encodedPayload)
  const receivedBuffer = Buffer.from(receivedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (receivedBuffer.length !== expectedBuffer.length || !timingSafeEqual(receivedBuffer, expectedBuffer)) {
    return null
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null
  }

  const { exp: _exp, ...user } = payload
  return user
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifySessionToken(token)
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
