import { NextResponse } from "next/server"
import { deleteCurriculumItem, updateCurriculumItem } from "@/lib/db"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { CurriculumPayload } from "@/lib/types"

type RouteContext = {
  params: Promise<{
    itemId: string
  }>
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession()
    const { itemId } = await context.params
    const payload = (await request.json()) as Partial<CurriculumPayload>
    return NextResponse.json({ data: await updateCurriculumItem(itemId, payload) })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession()
    const { itemId } = await context.params
    await deleteCurriculumItem(itemId)
    return NextResponse.json({ data: null })
  } catch (error) {
    return handleRouteError(error)
  }
}
