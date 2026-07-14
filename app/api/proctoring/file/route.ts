import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"

const PROCTORING_DATA_DIR = join(process.cwd(), "proctoring-data")

export async function GET(request: Request) {
  try {
    await requireAdminSession()

    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")

    if (!filePath) {
      return NextResponse.json({ error: "Missing file path." }, { status: 400 })
    }

    // Prevent path traversal attacks
    const sanitizedPath = filePath.replace(/\.\.\//g, "").replace(/\.\.\\/g, "")
    const absolutePath = join(PROCTORING_DATA_DIR, sanitizedPath)

    // Ensure the path is within the proctoring data directory
    if (!absolutePath.startsWith(PROCTORING_DATA_DIR)) {
      return NextResponse.json({ error: "Invalid file path." }, { status: 400 })
    }

    try {
      const buffer = await readFile(absolutePath)
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "video/webm",
          "Cache-Control": "private, max-age=3600",
        },
      })
    } catch {
      return NextResponse.json({ error: "File not found." }, { status: 404 })
    }
  } catch (error) {
    return handleRouteError(error)
  }
}
