import { NextResponse } from "next/server"
import { writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { saveScreenRecording } from "@/lib/db"
import { handleRouteError, requireStudentSession } from "@/lib/route-helpers"

const PROCTORING_DATA_DIR = join(process.cwd(), "proctoring-data")

export async function POST(request: Request) {
  try {
    const student = await requireStudentSession()

    const formData = await request.formData()
    const chunk = formData.get("chunk") as Blob | null
    const durationSeconds = Number(formData.get("durationSeconds") || 0)

    if (!chunk) {
      return NextResponse.json({ error: "No recording chunk provided." }, { status: 400 })
    }

    // Convert blob to buffer
    const arrayBuffer = await chunk.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Store on disk: proctoring-data/{exam_id}/{user_id}/{timestamp}.webm
    const timestamp = Date.now()
    const relativeDir = join(student.id)
    const absoluteDir = join(PROCTORING_DATA_DIR, relativeDir)

    await mkdir(absoluteDir, { recursive: true })

    const fileName = `screen_${timestamp}.webm`
    const filePath = join(absoluteDir, fileName)
    await writeFile(filePath, buffer)

    // Save record to database
    const dbPath = join(relativeDir, fileName)
    const result = await saveScreenRecording(student.id, dbPath, durationSeconds)

    return NextResponse.json({ data: result })
  } catch (error) {
    return handleRouteError(error)
  }
}
