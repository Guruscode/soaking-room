"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { ExamConfig, ExamQuestion, ProctoringCameraSnapshot, ProctoringEvent, ProctoringScreenRecording } from "@/lib/types"

type SummaryItem = {
  userId: string
  studentName: string
  studentEmail: string
  isSubmitted: boolean
  snapshotCount: number
  recordings: { count: number; totalDuration: number }
  events: Record<string, number>
}

type ProctoringPageData = {
  config: ExamConfig
  questions: ExamQuestion[]
  summaries: SummaryItem[]
}

type StudentProctoringData = {
  snapshots: ProctoringCameraSnapshot[]
  recordings: ProctoringScreenRecording[]
  events: ProctoringEvent[]
}

export default function AdminExamProctoringPage() {
  const { toast } = useToast()
  const [data, setData] = useState<ProctoringPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [studentData, setStudentData] = useState<StudentProctoringData | null>(null)
  const [isLoadingStudent, setIsLoadingStudent] = useState(false)
  const [activeTab, setActiveTab] = useState<"snapshots" | "recordings" | "events">("snapshots")

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/exams/proctoring", { cache: "no-store", credentials: "include" })
      const json = (await response.json()) as { data?: ProctoringPageData; error?: string }
      if (!response.ok) throw new Error(json.error || "Failed to load proctoring data.")
      setData(json.data || null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Proctoring data unavailable",
        description: getErrorMessage(error, "Failed to load proctoring data."),
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const openStudentProctoring = async (userId: string) => {
    setSelectedUserId(userId)
    setIsLoadingStudent(true)
    setStudentData(null)

    try {
      const response = await fetch(`/api/admin/exams/proctoring?userId=${encodeURIComponent(userId)}`, {
        cache: "no-store",
        credentials: "include",
      })
      const json = (await response.json()) as { data?: StudentProctoringData; error?: string }
      if (!response.ok) throw new Error(json.error || "Failed to load student proctoring data.")
      setStudentData(json.data || null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Student data unavailable",
        description: getErrorMessage(error, "Failed to load student proctoring data."),
      })
    } finally {
      setIsLoadingStudent(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
        <Spinner />
        Loading proctoring data...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h2 className="font-semibold text-red-900">Could not load proctoring data</h2>
          <p className="mt-1 text-sm text-red-700">Refresh the page or try again later.</p>
        </div>
      </div>
    )
  }

  // Group summaries: on-proctoring first, then by snapshot count
  const sortedSummaries = [...data.summaries].sort((a, b) => {
    // Students with no proctoring data go to the bottom
    const aHasData = a.snapshotCount > 0 || a.recordings.count > 0
    const bHasData = b.snapshotCount > 0 || b.recordings.count > 0
    if (aHasData && !bHasData) return -1
    if (!aHasData && bHasData) return 1
    return 0
  })

  const tabSwitchCount = (events: Record<string, number>) => {
    const hidden = events["visibility_hidden"] || 0
    const visible = events["visibility_visible"] || 0
    return Math.max(hidden, visible)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-2xl font-semibold">Exam Proctoring</h2>
        <p className="mt-1 text-sm text-slate-600">
          {data.config.title} &mdash; {data.config.courseCode} &middot; {data.config.cohort}
          {data.config.requiresProctoring ? (
            <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              Proctoring Enabled
            </span>
          ) : (
            <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              Proctoring Disabled
            </span>
          )}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Students</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{data.summaries.length}</p>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm text-indigo-600">With Camera Data</p>
          <p className="mt-1 text-lg font-semibold text-indigo-900">
            {data.summaries.filter((s) => s.snapshotCount > 0).length}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-600">With Screen Recordings</p>
          <p className="mt-1 text-lg font-semibold text-blue-900">
            {data.summaries.filter((s) => s.recordings.count > 0).length}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-600">Flagged (tab switches)</p>
          <p className="mt-1 text-lg font-semibold text-amber-900">
            {data.summaries.filter((s) => tabSwitchCount(s.events) > 3).length}
          </p>
        </div>
      </div>

      {/* Students list */}
      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Students</h3>

        {sortedSummaries.length === 0 ? (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No proctoring data available.
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {sortedSummaries.map((summary) => (
              <div
                key={summary.userId}
                className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{summary.studentName}</p>
                      {summary.isSubmitted ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">{summary.studentEmail}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>📷 {summary.snapshotCount} snapshots</span>
                      <span>🎥 {summary.recordings.count} recordings ({Math.round(summary.recordings.totalDuration / 60)} min)</span>
                      {tabSwitchCount(summary.events) > 0 && (
                        <span className={tabSwitchCount(summary.events) > 3 ? "text-red-600 font-medium" : ""}>
                          🔄 {tabSwitchCount(summary.events)} tab switches
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => openStudentProctoring(summary.userId)}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Proctoring Details Modal */}
      <Dialog open={Boolean(selectedUserId)} onOpenChange={(open) => { if (!open) { setSelectedUserId(null); setStudentData(null) } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Proctoring Data
              {selectedUserId && data.summaries.find((s) => s.userId === selectedUserId)?.studentName
                ? ` — ${data.summaries.find((s) => s.userId === selectedUserId)!.studentName}`
                : ""}
            </DialogTitle>
          </DialogHeader>

          {isLoadingStudent ? (
            <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
              <Spinner />
              Loading proctoring data...
            </div>
          ) : studentData ? (
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                {(["snapshots", "recordings", "events"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "snapshots" ? `📷 Snapshots (${studentData.snapshots.length})` : ""}
                    {tab === "recordings" ? `🎥 Recordings (${studentData.recordings.length})` : ""}
                    {tab === "events" ? `📋 Events (${studentData.events.length})` : ""}
                  </button>
                ))}
              </div>

              {/* Snapshots tab */}
              {activeTab === "snapshots" && (
                <div>
                  {studentData.snapshots.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                      No camera snapshots captured.
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {studentData.snapshots.map((snap) => (
                        <div key={snap.id} className="rounded-xl border border-slate-200 overflow-hidden">
                          <img
                            src={snap.imageBase64}
                            alt={`Snapshot at ${new Date(snap.capturedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "medium" })}`}
                            className="w-full aspect-[4/3] object-cover"
                          />
                          <div className="px-2 py-1.5 text-xs text-slate-500">
                            {new Date(snap.capturedAt).toLocaleString("en-NG", { dateStyle: "short", timeStyle: "medium" })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recordings tab */}
              {activeTab === "recordings" && (
                <div>
                  {studentData.recordings.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                      No screen recordings captured.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {studentData.recordings.map((rec) => (
                        <div key={rec.id} className="rounded-xl border border-slate-200 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                Recording — {Math.round(rec.durationSeconds)}s
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(rec.capturedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "medium" })}
                              </p>
                            </div>
                            <video
                              src={`/api/proctoring/file?path=${encodeURIComponent(rec.filePath)}`}
                              controls
                              className="w-48 rounded-lg border border-slate-200"
                              preload="metadata"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Events tab */}
              {activeTab === "events" && (
                <div>
                  {studentData.events.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                      No proctoring events recorded.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {studentData.events.map((event) => (
                        <div key={event.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                event.eventType === "visibility_hidden" || event.eventType === "camera_stopped" || event.eventType === "screen_share_stopped"
                                  ? "bg-red-100 text-red-700"
                                  : event.eventType === "proctoring_started"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-100 text-slate-700"
                              }`}>
                                {event.eventType.replace(/_/g, " ")}
                              </span>
                              {event.eventData && (
                                <span className="text-xs text-slate-500">{event.eventData}</span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              {new Date(event.createdAt).toLocaleString("en-NG", { dateStyle: "short", timeStyle: "medium" })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Could not load student proctoring data.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
