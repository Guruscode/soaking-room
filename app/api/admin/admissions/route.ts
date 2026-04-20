import { NextResponse } from "next/server"
import { createAdmission, listAdmissions, listAdmissionsByCreatedAtRange } from "@/lib/db"
import { AppError } from "@/lib/errors"
import { handleRouteError, requireAdminSession } from "@/lib/route-helpers"
import type { AdminStudentPayload } from "@/lib/types"

function normalizeDateRange(searchParams: URLSearchParams) {
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  if (!startDate || !endDate) {
    throw new AppError("Start date and end date are required.", 400)
  }

  const start = new Date(`${startDate}T00:00:00.000Z`)
  const end = new Date(`${endDate}T00:00:00.000Z`)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError("Invalid date range supplied.", 400)
  }

  if (start > end) {
    throw new AppError("Start date cannot be after end date.", 400)
  }

  const inclusiveEnd = new Date(end)
  inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() + 1)

  return {
    startDateTime: start.toISOString(),
    endDateTimeExclusive: inclusiveEnd.toISOString(),
    startDate,
    endDate,
  }
}

function escapeCsvValue(value: string | null | undefined) {
  const normalized = value ?? ""
  return `"${normalized.replace(/"/g, '""')}"`
}

function buildAdmissionsCsv(rows: Awaited<ReturnType<typeof listAdmissions>>) {
  const headers = [
    "Full Name",
    "Date of Birth / Age",
    "Category",
    "Location",
    "Email",
    "Phone",
    "Born Again",
    "Church / Fellowship",
    "Musical Skill",
    "Reason",
    "Admission Status",
    "Created At",
    "Updated At",
  ]

  const lines = rows.map((row) =>
    [
      row.fullName,
      row.dateOfBirthOrAge,
      row.category,
      row.location,
      row.email,
      row.phone,
      row.bornAgain,
      row.church,
      row.musicalSkill,
      row.reason,
      row.admissionStatus,
      row.createdAt,
      row.updatedAt,
    ]
      .map((value) => escapeCsvValue(value))
      .join(","),
  )

  return [headers.map((header) => escapeCsvValue(header)).join(","), ...lines].join("\n")
}

export async function GET(request: Request) {
  try {
    await requireAdminSession()
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format")

    if (format === "csv") {
      const { startDateTime, endDateTimeExclusive, startDate, endDate } = normalizeDateRange(searchParams)
      const admissions = await listAdmissionsByCreatedAtRange(startDateTime, endDateTimeExclusive)
      const csv = buildAdmissionsCsv(admissions)

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="admissions-${startDate}-to-${endDate}.csv"`,
        },
      })
    }

    const admissions = await listAdmissions()
    return NextResponse.json({ data: admissions })
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession()
    const payload = (await request.json()) as AdminStudentPayload
    const admission = await createAdmission(payload)
    return NextResponse.json({ data: admission })
  } catch (error) {
    return handleRouteError(error)
  }
}
