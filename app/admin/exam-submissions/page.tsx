"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { ExamAnswerItem, ExamConfig, ExamQuestion } from "@/lib/types"

type SubmissionsData = {
  config: ExamConfig
  questions: ExamQuestion[]
  submissions: ExamAnswerItem[]
  adminName: string
}

export default function AdminExamSubmissionsPage() {
  const { toast } = useToast()
  const [data, setData] = useState<SubmissionsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewingAnswers, setViewingAnswers] = useState<ExamAnswerItem | null>(null)
  const [scoreInput, setScoreInput] = useState("")
  const [isSavingScore, setIsSavingScore] = useState(false)
  const [isPushingResults, setIsPushingResults] = useState(false)
  const [isSubmittingOverdue, setIsSubmittingOverdue] = useState(false)

  const loadData = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/exams/submissions", { cache: "no-store", credentials: "include" })
      const json = (await response.json()) as { data?: SubmissionsData; error?: string }

      if (!response.ok) {
        throw new Error(json.error || "Failed to load submissions.")
      }

      setData(json.data || null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submissions unavailable",
        description: getErrorMessage(error, "Failed to load submissions data."),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const openAnswerModal = (submission: ExamAnswerItem) => {
    setViewingAnswers(submission)
    setScoreInput(submission.score === null ? "" : String(submission.score))
  }

  const saveScore = async () => {
    if (!viewingAnswers) return

    setIsSavingScore(true)

    try {
      const score = scoreInput.trim() === "" ? null : Number(scoreInput)

      const response = await fetch("/api/admin/exams/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answerId: viewingAnswers.id, score }),
      })
      const json = (await response.json()) as { data?: ExamAnswerItem; error?: string }

      if (!response.ok) {
        throw new Error(json.error || "Failed to save score.")
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              submissions: prev.submissions.map((s) =>
                s.id === viewingAnswers.id
                  ? { ...s, score, reviewedAt: new Date().toISOString(), reviewedBy: prev.adminName }
                  : s
              ),
            }
          : null
      )

      setViewingAnswers((prev) =>
        prev ? { ...prev, score, reviewedAt: new Date().toISOString(), reviewedBy: data?.adminName || "" } : null
      )

      toast({
        title: "Score saved",
        description: "The student's score has been updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: getErrorMessage(error, "Failed to save score."),
      })
    } finally {
      setIsSavingScore(false)
    }
  }

  const pushResults = async () => {
    if (!data) return

    setIsPushingResults(true)

    try {
      const response = await fetch("/api/admin/exams/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      const json = (await response.json()) as { data?: { notifiedCount: number }; error?: string }

      if (!response.ok) {
        throw new Error(json.error || "Failed to push results.")
      }

      const count = json.data?.notifiedCount ?? 0

      toast({
        title: "Results pushed",
        description:
          count > 0
            ? `${count} student(s) have been notified of their scores via email.`
            : "No new results to push. All scored submissions have already been notified.",
      })

      // Update local state to reflect notified status without full reload
      if (count > 0) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                submissions: prev.submissions.map((s) =>
                  s.score !== null && !s.resultsNotified ? { ...s, resultsNotified: true } : s
                ),
              }
            : null
        )
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Push failed",
        description: getErrorMessage(error, "Failed to push results."),
      })
    } finally {
      setIsPushingResults(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
        <Spinner />
        Loading submissions...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h2 className="font-semibold text-red-900">Could not load submissions</h2>
          <p className="mt-1 text-sm text-red-700">Refresh the page or try again later.</p>
        </div>
      </div>
    )
  }

  const submittedCount = data.submissions.length
  const scoredCount = data.submissions.filter((s) => s.score !== null).length
  const notifyPendingCount = data.submissions.filter((s) => s.score !== null && !s.resultsNotified).length

  const downloadCsv = () => {
    if (!data) return

    // Build CSV rows
    const csvRows: string[][] = []

    // Header row
    csvRows.push(["Student Name", "Email", "Status", "Submitted At", "Score", "Notified"])

    for (const s of data.submissions) {
      csvRows.push([
        s.studentName,
        s.studentEmail,
        s.isSubmitted ? "Submitted" : "In progress",
        s.submittedAt
          ? new Date(s.submittedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })
          : "",
        s.score !== null ? `${s.score} / ${data.config.totalMarks}` : "Pending",
        s.resultsNotified ? "Yes" : s.score !== null ? "No" : "",
      ])
    }

    // Escape and encode as CSV
    const csvContent = csvRows
      .map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const escaped = cell.replace(/"/g, '""')
            return /[,"\n]/.test(escaped) ? `"${escaped}"` : escaped
          })
          .join(","),
      )
      .join("\n")

    // Prepending BOM (\uFEFF) for Excel UTF-8 compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${data.config.courseCode}_submissions_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Exam Submissions</h2>
            <p className="mt-1 text-sm text-slate-600">
              {data.config.title} &mdash; {data.config.courseCode} &middot; {data.config.cohort}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={downloadCsv}
            >
              <svg className="mr-1.5 size-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download CSV
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={async () => {
                setIsSubmittingOverdue(true)
                try {
                  const res = await fetch("/api/admin/exams/auto-submit-overdue", {
                    method: "POST",
                    credentials: "include",
                  })
                  const json = (await res.json()) as { data?: { count: number }; error?: string }
                  if (!res.ok) throw new Error(json.error || "Failed to submit overdue exams.")
                  const count = json.data?.count ?? 0
                  toast({
                    title: count > 0 ? `${count} overdue exam(s) submitted` : "No overdue exams to submit",
                    description: count > 0
                      ? `Students whose time had expired have been auto-submitted. Refresh to see them.`
                      : `All pending exams are still within their time limit.`,
                  })
                  if (count > 0) {
                    void loadData()
                  }
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Auto-submit failed",
                    description: getErrorMessage(error, "Failed to submit overdue exams."),
                  })
                } finally {
                  setIsSubmittingOverdue(false)
                }
              }}
              disabled={isSubmittingOverdue}
            >
              {isSubmittingOverdue ? <Spinner className="size-4" /> : null}
              Force Submit Overdue
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
              onClick={pushResults}
              disabled={isPushingResults || notifyPendingCount === 0}
            >
              {isPushingResults ? <Spinner className="size-4" /> : null}
              Push All Results
              {notifyPendingCount > 0 ? (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-medium">
                  {notifyPendingCount}
                </span>
              ) : null}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Submitted</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{submittedCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-600">Scored</p>
          <p className="mt-1 text-lg font-semibold text-emerald-900">
            {scoredCount}
            {notifyPendingCount > 0 ? (
              <span className="ml-2 text-sm font-normal text-emerald-500">
                ({notifyPendingCount} pending notify)
              </span>
            ) : null}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-600">Email Notified</p>
          <p className="mt-1 text-lg font-semibold text-blue-900">
            {data.submissions.filter((s) => s.resultsNotified).length}
          </p>
        </div>
      </div>

      {/* Submissions list */}
      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Student Submissions</h3>

        {data.submissions.length === 0 ? (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No submissions yet. Submissions will appear here once students submit their exam or the timer runs out.
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {data.submissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{submission.studentName}</p>
                      {submission.resultsNotified ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Notified
                        </span>
                      ) : submission.score !== null ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Not notified
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">{submission.studentEmail}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right text-sm">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        submission.isSubmitted
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {submission.isSubmitted ? "Submitted" : "In progress"}
                    </span>
                    {submission.submittedAt ? (
                      <p className="text-slate-500">
                        {new Date(submission.submittedAt).toLocaleString("en-NG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    ) : null}
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700">
                        Score: {submission.score ?? "Pending"}
                        {submission.score !== null ? (
                          <span className="text-slate-400">/{data.config.totalMarks}</span>
                        ) : null}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {submission.isSubmitted ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => openAnswerModal(submission)}
                    >
                      View & Score
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answers & Scoring Modal */}
      <Dialog open={Boolean(viewingAnswers)} onOpenChange={(open) => { if (!open) setViewingAnswers(null) }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {viewingAnswers?.studentName || "Student Answers"}
              {viewingAnswers?.resultsNotified ? (
                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  ✓ Notified
                </span>
              ) : null}
            </DialogTitle>
            <DialogDescription>
              View the student&apos;s answers and assign a score. Scores are saved silently — use
              &quot;Push All Results&quot; to release scores to students.
            </DialogDescription>
          </DialogHeader>

          {viewingAnswers ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-sm text-slate-500">
                  Submitted:{" "}
                  {viewingAnswers.submittedAt
                    ? new Date(viewingAnswers.submittedAt).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </p>
                {viewingAnswers.reviewedAt ? (
                  <p className="text-sm text-slate-500">
                    Reviewed by {viewingAnswers.reviewedBy} on{" "}
                    {new Date(viewingAnswers.reviewedAt).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                ) : null}
                {viewingAnswers.resultsNotified ? (
                  <p className="text-sm font-medium text-emerald-600">
                    ✓ Results released to student
                  </p>
                ) : viewingAnswers.score !== null ? (
                  <p className="text-sm font-medium text-amber-600">
                    ⏳ Score saved — not yet released to student
                  </p>
                ) : null}
              </div>

              {(() => {
                try {
                  const parsedAnswers = JSON.parse(viewingAnswers.answers) as Array<{
                    questionId: string
                    answer: string
                  }>
                  const answerMap = new Map(parsedAnswers.map((a) => [a.questionId, a.answer]))

                  return data.questions.map((q) => (
                    <div key={q.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex gap-3">
                        <span className="shrink-0 text-sm font-bold text-slate-400">
                          Q{q.questionNumber}.
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            {q.questionText.substring(0, 200)}...
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-slate-500">
                            [{q.marks} marks]
                          </p>
                          <div className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-700">
                            {answerMap.get(q.id) || (
                              <span className="italic text-slate-400">No answer provided</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                } catch {
                  return (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      Could not parse answers data.
                    </div>
                  )
                }
              })()}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Score (out of {data.config.totalMarks})
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    max={data.config.totalMarks}
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    placeholder="Enter score"
                    className="max-w-40"
                  />
                  <Button
                    type="button"
                    className="rounded-xl bg-slate-900"
                    disabled={isSavingScore}
                    onClick={saveScore}
                  >
                    {isSavingScore ? <Spinner className="size-4" /> : null}
                    Save Score
                  </Button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Scores are saved privately. Use &quot;Push All Results&quot; on the main page to
                  release scores to students and notify them via email.
                </p>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setViewingAnswers(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
