import { NextResponse } from "next/server"
import { createBroadcast, listBroadcasts } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { BroadcastPayload } from "@/lib/types"

export async function GET() {
  try {
    await requireAdminSession()
    return NextResponse.json({ data: await listBroadcasts() })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession()
    const payload = (await request.json()) as BroadcastPayload
    return NextResponse.json({ data: await createBroadcast(payload) })
  } catch (error) {
    return handleRouteError(error)
  }
}
