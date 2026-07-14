"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { ExamConfig, ExamConfigPayload, ExamQuestion, ExamAnswerItem } from "@/lib/types"

type ExamData = {
  config: ExamConfig
  questions: ExamQuestion[]
  submissions: ExamAnswerItem[]
  adminName: string
}

export default function AdminExamsPage() {
  const { toast } = useToast()
  const [data, setData] = useState<ExamData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)
  const [viewingAnswers, setViewingAnswers] = useState<ExamAnswerItem | null>(null)
  const [scoreInput, setScoreInput] = useState("")
  const [isSavingScore, setIsSavingScore] = useState(false)
  const [isEditConfigOpen, setIsEditConfigOpen] = useState(false)
  const [configForm, setConfigForm] = useState<ExamConfigPayload>({
    title: "",
    description: "",
    courseCode: "",
    cohort: "",
    totalMarks: 165,
    durationMinutes: 180,
    instructions: "",
  })
  const [isSavingConfig, setIsSavingConfig] = useState(false)

  const loadData = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/exams", { cache: "no-store", credentials: "include" })
      const json = (await response.json()) as { data?: ExamData; error?: string }

      if (!response.ok) {
        throw new Error(json.error || "Failed to load exam data.")
      }

      setData(json.data || null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Exam data unavailable",
        description: getErrorMessage(error, "Failed to load exam data."),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const toggleExamStatus = async () => {
    if (!data) return

    setIsToggling(true)

    const nextStatus = data.config.status === "active" ? "inactive" : "active"

    try {
      const response = await fetch("/api/admin/exams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: nextStatus }),
      })
      const json = (await response.json()) as { data?: ExamConfig; error?: string }

      if (!response.ok || !json.data) {
        throw new Error(json.error || "Failed to update exam status.")
      }

      setData((prev) => (prev ? { ...prev, config: json.data! } : null))
      toast({
        title: nextStatus === "active" ? "Exam started" : "Exam stopped",
        description:
          nextStatus === "active"
            ? "Students can now see and write the exam."
            : "The exam is no longer accessible to students.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: getErrorMessage(error, "Failed to update exam status."),
      })
    } finally {
      setIsToggling(false)
    }
  }

  const openEditConfig = () => {
    if (!data) return
    setConfigForm({
      title: data.config.title,
      description: data.config.description,
      courseCode: data.config.courseCode,
      cohort: data.config.cohort,
      totalMarks: data.config.totalMarks,
      durationMinutes: data.config.durationMinutes,
      instructions: data.config.instructions,
      requiresProctoring: data.config.requiresProctoring,
    })
    setIsEditConfigOpen(true)
  }

  const saveConfig = async () => {
    if (!data) return
    setIsSavingConfig(true)

    try {
      const response = await fetch("/api/admin/exams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(configForm),
      })
      const json = (await response.json()) as { data?: ExamConfig; error?: string }

      if (!response.ok || !json.data) {
        throw new Error(json.error || "Failed to update exam configuration.")
      }

      setData((prev) => (prev ? { ...prev, config: json.data! } : null))
      setIsEditConfigOpen(false)
      toast({
        title: "Configuration updated",
        description: "The exam settings have been saved.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: getErrorMessage(error, "Failed to update exam configuration."),
      })
    } finally {
      setIsSavingConfig(false)
    }
  }

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
              submissions: prev.submissions.map((s) => (s.id === viewingAnswers.id ? { ...s, score, reviewedAt: new Date().toISOString(), reviewedBy: prev.adminName } : s)),
            }
          : null,
      )

      setViewingAnswers((prev) => (prev ? { ...prev, score, reviewedAt: new Date().toISOString(), reviewedBy: data?.adminName || "" } : null))

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

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
        <Spinner />
        Loading exam data...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h2 className="font-semibold text-red-900">Could not load exam data</h2>
          <p className="mt-1 text-sm text-red-700">Refresh the page or try again later.</p>
        </div>
      </div>
    )
  }

  const submittedCount = data.submissions.filter((s) => s.isSubmitted).length
  const unsubmittedCount = data.submissions.filter((s) => !s.isSubmitted).length
  const reviewedCount = data.submissions.filter((s) => s.score !== null).length

  const sections = data.questions.reduce(
    (acc, q) => {
      if (!acc[q.sectionTitle]) acc[q.sectionTitle] = []
      acc[q.sectionTitle].push(q)
      return acc
    },
    {} as Record<string, ExamQuestion[]>,
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Exams CMS</h2>
            <p className="mt-1 text-sm text-slate-600">
              {data.config.title} &mdash; {data.config.description}
            </p>
          </div>
          <Button
            type="button"
            className={`rounded-xl ${data.config.status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
            onClick={toggleExamStatus}
            disabled={isToggling}
          >
            {isToggling ? <Spinner className="size-4" /> : null}
            {data.config.status === "active" ? "Stop Exam" : "Start Exam"}
          </Button>
        </div>
      </div>

      {/* Exam Info Cards */}
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900">Exam Settings</h3>
          <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={openEditConfig}>
            Edit Config
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <div className={`rounded-xl border p-4 ${data.config.status === "active" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
            <p className="text-sm text-slate-500">Status</p>
            <p className={`mt-1 text-lg font-semibold capitalize ${data.config.status === "active" ? "text-emerald-900" : "text-slate-900"}`}>
              {data.config.status}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Total Marks</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{data.config.totalMarks}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Duration</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{data.config.durationMinutes} mins</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{data.config.courseCode}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{data.config.cohort}</p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Questions ({data.questions.length} total)</h3>
        <div className="mt-3 space-y-6">
          {Object.entries(sections).map(([sectionTitle, sectionQuestions]) => (
            <div key={sectionTitle}>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{sectionTitle}</h4>
              <div className="mt-2 space-y-2">
                {sectionQuestions.map((q) => (
                  <div key={q.id} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                    <span className="shrink-0 font-bold text-slate-400">Q{q.questionNumber}.</span>
                    <div>
                      <p className="text-slate-800">{q.questionText.substring(0, 200)}...</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{q.marks} marks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions */}
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Student Submissions</h3>
          <p className="text-sm text-slate-500">
            {submittedCount} submitted &middot; {unsubmittedCount} in progress &middot; {reviewedCount} reviewed
          </p>
        </div>

        {data.submissions.length === 0 ? (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No submissions yet.
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {data.submissions.map((submission) => (
              <div key={submission.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{submission.studentName}</p>
                    <p className="text-sm text-slate-500">{submission.studentEmail}</p>
                  </div>
                  <div className="text-right text-sm">
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
                      <p className="mt-1 text-slate-500">
                        {new Date(submission.submittedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    ) : null}
                    <p className="mt-1 font-medium text-slate-700">
                      Score: {submission.score ?? "Pending"}
                    </p>
                  </div>
                </div>
                {submission.isSubmitted ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => openAnswerModal(submission)}
                    >
                      View Answers
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50"
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/admin/exams/reset-submission", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ answerId: submission.id }),
                          })
                          const json = (await res.json()) as { data?: { success: boolean }; error?: string }
                          if (!res.ok) throw new Error(json.error || "Failed to reopen exam.")

                          toast({
                            title: "Exam reopened",
                            description: `${submission.studentName} can now re-enter the exam.`,
                          })
                          await loadData()
                        } catch (error) {
                          toast({
                            variant: "destructive",
                            title: "Failed to reopen",
                            description: getErrorMessage(error, "Could not reopen the exam."),
                          })
                        }
                      }}
                    >
                      Reopen Exam
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Config Dialog */}
      <Dialog open={isEditConfigOpen} onOpenChange={setIsEditConfigOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Exam Configuration</DialogTitle>
            <DialogDescription>
              Update the exam title, description, duration, marks, and other settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <Input
                value={configForm.title}
                onChange={(e) => setConfigForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <Input
                value={configForm.description}
                onChange={(e) => setConfigForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Course Code</label>
                <Input
                  value={configForm.courseCode}
                  onChange={(e) => setConfigForm((prev) => ({ ...prev, courseCode: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Cohort</label>
                <Input
                  value={configForm.cohort}
                  onChange={(e) => setConfigForm((prev) => ({ ...prev, cohort: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Total Marks</label>
                <Input
                  type="number"
                  min="1"
                  value={configForm.totalMarks}
                  onChange={(e) => setConfigForm((prev) => ({ ...prev, totalMarks: Number(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Duration (minutes)</label>
                <Input
                  type="number"
                  min="1"
                  value={configForm.durationMinutes}
                  onChange={(e) => setConfigForm((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Instructions</label>
              <Textarea
                rows={6}
                value={configForm.instructions}
                onChange={(e) => setConfigForm((prev) => ({ ...prev, instructions: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Checkbox
                id="requiresProctoring"
                checked={configForm.requiresProctoring ?? false}
                onCheckedChange={(checked) =>
                  setConfigForm((prev) => ({ ...prev, requiresProctoring: checked === true }))
                }
              />
              <label htmlFor="requiresProctoring" className="cursor-pointer">
                <p className="text-sm font-medium text-slate-900">Requires Proctoring</p>
                <p className="text-xs text-slate-500">
                  When enabled, students must grant camera and screen sharing permissions before starting the exam. Proctoring data (camera snapshots and screen recordings) will be captured every 60 seconds. If proctoring is interrupted, the exam will be auto-submitted.
                </p>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsEditConfigOpen(false)} disabled={isSavingConfig}>
              Cancel
            </Button>
            <Button type="button" className="rounded-xl bg-slate-900" onClick={saveConfig} disabled={isSavingConfig}>
              {isSavingConfig ? <Spinner className="size-4" /> : null}
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Answers Modal */}
      <Dialog open={Boolean(viewingAnswers)} onOpenChange={(open) => { if (!open) setViewingAnswers(null) }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingAnswers?.studentName || "Student Answers"}</DialogTitle>
            <DialogDescription>
              View the student&apos;s answers and assign a score.
            </DialogDescription>
          </DialogHeader>

          {viewingAnswers ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-sm text-slate-500">Submitted: {viewingAnswers.submittedAt ? new Date(viewingAnswers.submittedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "N/A"}</p>
                {viewingAnswers.reviewedAt ? (
                  <p className="text-sm text-slate-500">Reviewed by {viewingAnswers.reviewedBy} on {new Date(viewingAnswers.reviewedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p>
                ) : null}
              </div>

              {(() => {
                try {
                  const answers = JSON.parse(viewingAnswers.answers) as Array<{ questionId: string; answer: string }>
                  const answerMap = new Map(answers.map((a) => [a.questionId, a.answer]))

                  return data.questions.map((q) => (
                    <div key={q.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex gap-3">
                        <span className="shrink-0 text-sm font-bold text-slate-400">Q{q.questionNumber}.</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{q.questionText.substring(0, 150)}...</p>
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Score (out of {data.config.totalMarks})</label>
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
