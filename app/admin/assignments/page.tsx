"use client"

import { useEffect, useState } from "react"
import { AdminRowActions } from "@/components/admin-row-actions"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { BROADCAST_AUDIENCE_OPTIONS } from "@/lib/academy-options"
import { getErrorMessage } from "@/lib/errors"
import type { AssignmentItem, AssignmentPayload, AssignmentSubmissionItem } from "@/lib/types"

const initialFormState: AssignmentPayload = {
  title: "",
  audience: "All Students",
  instructions: "",
  dueDate: "",
}

type ReviewFormState = {
  score: string
  adminComment: string
  isSaving: boolean
}

function buildReviewFormState(submission: AssignmentSubmissionItem): ReviewFormState {
  return {
    score: submission.score === null ? "" : String(submission.score),
    adminComment: submission.adminComment || "",
    isSaving: false,
  }
}

export default function AdminAssignmentsPage() {
  const { toast } = useToast()
  const [rows, setRows] = useState<AssignmentItem[]>([])
  const [formState, setFormState] = useState(initialFormState)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [viewingAssignment, setViewingAssignment] = useState<AssignmentItem | null>(null)
  const [submissions, setSubmissions] = useState<AssignmentSubmissionItem[]>([])
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false)
  const [reviewForms, setReviewForms] = useState<Record<string, ReviewFormState>>({})
  const [submissionSearch, setSubmissionSearch] = useState("")
  const [reviewFilter, setReviewFilter] = useState<"all" | "reviewed" | "pending">("all")

  const loadRows = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/assignments", { cache: "no-store", credentials: "include" })
      const data = (await response.json()) as { data?: AssignmentItem[]; error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Failed to load assignments.")
      }

      setRows(data.data || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Assignments unavailable",
        description: getErrorMessage(error, "Failed to load assignments."),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadRows()
  }, [])

  const resetForm = () => {
    setFormState(initialFormState)
    setEditingId(null)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    resetForm()
  }

  const openCreateModal = () => {
    resetForm()
    setIsFormModalOpen(true)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(editingId ? `/api/admin/assignments/${editingId}` : "/api/admin/assignments", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formState),
      })
      const data = (await response.json()) as { data?: AssignmentItem; error?: string }

      if (!response.ok || !data.data) {
        throw new Error(data.error || "Failed to save assignment.")
      }

      setRows((prev) =>
        [...(editingId ? prev.map((row) => (row.id === editingId ? data.data! : row)) : [...prev, data.data!])]
          .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime()),
      )
      toast({
        title: editingId ? "Assignment updated" : "Assignment created",
        description: `${data.data.title} has been saved.`,
      })
      closeFormModal()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: getErrorMessage(error, "Failed to save assignment."),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const onEdit = (item: AssignmentItem) => {
    setEditingId(item.id)
    setFormState({
      title: item.title,
      audience: item.audience,
      instructions: item.instructions,
      dueDate: item.dueDate,
    })
    setIsFormModalOpen(true)
  }

  const onDelete = async (item: AssignmentItem) => {
    try {
      const response = await fetch(`/api/admin/assignments/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete assignment.")
      }

      setRows((prev) => prev.filter((row) => row.id !== item.id))
      toast({
        title: "Assignment deleted",
        description: `${item.title} has been removed.`,
      })

      if (editingId === item.id) {
        closeFormModal()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: getErrorMessage(error, "Failed to delete assignment."),
      })
    }
  }

  const openSubmissionsModal = async (assignment: AssignmentItem) => {
    setViewingAssignment(assignment)
    setIsLoadingSubmissions(true)

    try {
      const response = await fetch(`/api/admin/assignments/${assignment.id}/submissions`, {
        cache: "no-store",
        credentials: "include",
      })
      const data = (await response.json()) as { data?: AssignmentSubmissionItem[]; error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Failed to load submissions.")
      }

      const nextSubmissions = data.data || []
      setSubmissions(nextSubmissions)
      setReviewForms(
        Object.fromEntries(nextSubmissions.map((submission) => [submission.id, buildReviewFormState(submission)])),
      )
    } catch (error) {
      setSubmissions([])
      setReviewForms({})
      toast({
        variant: "destructive",
        title: "Submissions unavailable",
        description: getErrorMessage(error, "Failed to load assignment submissions."),
      })
    } finally {
      setIsLoadingSubmissions(false)
    }
  }

  const setReviewFormState = (submissionId: string, update: Partial<ReviewFormState>) => {
    setReviewForms((prev) => ({
      ...prev,
      [submissionId]: {
        ...(prev[submissionId] || { score: "", adminComment: "", isSaving: false }),
        ...update,
      },
    }))
  }

  const saveReview = async (submissionId: string) => {
    const form = reviewForms[submissionId]

    if (!form) {
      return
    }

    setReviewFormState(submissionId, { isSaving: true })

    try {
      const response = await fetch(`/api/admin/assignment-submissions/${submissionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          score: form.score === "" ? null : Number(form.score),
          adminComment: form.adminComment,
        }),
      })
      const data = (await response.json()) as { data?: AssignmentSubmissionItem; error?: string }

      if (!response.ok || !data.data) {
        throw new Error(data.error || "Failed to save review.")
      }

      setSubmissions((prev) => prev.map((submission) => (submission.id === submissionId ? data.data! : submission)))
      setReviewForms((prev) => ({
        ...prev,
        [submissionId]: buildReviewFormState(data.data!),
      }))
      toast({
        title: "Review saved",
        description: "The score and comment are now visible to the student.",
      })
    } catch (error) {
      setReviewFormState(submissionId, { isSaving: false })
      toast({
        variant: "destructive",
        title: "Review failed",
        description: getErrorMessage(error, "Failed to save assignment review."),
      })
      return
    }

    setReviewFormState(submissionId, { isSaving: false })
  }

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      !submissionSearch.trim() ||
      submission.studentName.toLowerCase().includes(submissionSearch.trim().toLowerCase()) ||
      submission.studentEmail.toLowerCase().includes(submissionSearch.trim().toLowerCase())

    const matchesReviewFilter =
      reviewFilter === "all" ||
      (reviewFilter === "reviewed" ? submission.reviewedAt : !submission.reviewedAt)

    return matchesSearch && matchesReviewFilter
  })

  const reviewedCount = submissions.filter((submission) => submission.reviewedAt).length
  const pendingCount = submissions.length - reviewedCount

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Assignments CMS</h2>
            <p className="mt-2 text-sm text-slate-600">Create, update, and remove assignments shown on the student dashboard.</p>
          </div>
          <Button type="button" className="rounded-xl bg-slate-900" onClick={openCreateModal}>
            Add Assignment
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Published Assignments</h3>
          <p className="text-sm text-slate-500">{rows.length} total</p>
        </div>
        <div className="mt-3 space-y-3 md:hidden">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              <Spinner />
              Loading assignments...
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{row.title}</p>
                    <p className="text-sm text-slate-500">
                      {row.audience} · Due {new Date(row.dueDate).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {row.submissionCount || 0} submission{row.submissionCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => void openSubmissionsModal(row)}>
                      View Submissions
                    </Button>
                    <AdminRowActions
                      recordName={row.title}
                      onEdit={() => onEdit(row)}
                      onDelete={() => onDelete(row)}
                    />
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{row.instructions}</p>
              </div>
            ))
          )}
        </div>
        <div className="mt-3 hidden overflow-x-auto md:block">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              <Spinner />
              Loading assignments...
            </div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Instructions</th>
                  <th className="py-2 pr-4 font-medium">Due Date</th>
                  <th className="py-2 pr-4 font-medium">Submissions</th>
                  <th className="py-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 text-slate-700 align-top">
                    <td className="py-2 pr-4">{row.title}</td>
                    <td className="py-2 pr-4">{row.audience}</td>
                    <td className="py-2 pr-4">{row.instructions}</td>
                    <td className="py-2 pr-4">{new Date(row.dueDate).toLocaleDateString("en-NG", { dateStyle: "medium" })}</td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-3">
                        <span>{row.submissionCount || 0}</span>
                        <Button type="button" variant="outline" size="sm" onClick={() => void openSubmissionsModal(row)}>
                          View Submissions
                        </Button>
                      </div>
                    </td>
                    <td className="py-2 text-right">
                      <div className="flex justify-end">
                        <AdminRowActions
                          recordName={row.title}
                          onEdit={() => onEdit(row)}
                          onDelete={() => onDelete(row)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog
        open={isFormModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeFormModal()
            return
          }

          setIsFormModalOpen(true)
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Assignment" : "Add Assignment"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update this assignment." : "Create a new assignment for students."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <Input
                value={formState.title}
                onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
              <select
                value={formState.audience}
                onChange={(event) => setFormState((prev) => ({ ...prev, audience: event.target.value }))}
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
              >
                {BROADCAST_AUDIENCE_OPTIONS.map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Due Date</label>
              <Input
                type="date"
                value={formState.dueDate}
                onChange={(event) => setFormState((prev) => ({ ...prev, dueDate: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Instructions</label>
              <Textarea
                rows={5}
                value={formState.instructions}
                onChange={(event) => setFormState((prev) => ({ ...prev, instructions: event.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeFormModal} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-slate-900" disabled={isSaving}>
                {isSaving ? <Spinner className="size-4" /> : null}
                {editingId ? "Update Assignment" : "Create Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(viewingAssignment)}
        onOpenChange={(open) => {
          if (!open) {
            setViewingAssignment(null)
            setSubmissions([])
            setReviewForms({})
            setSubmissionSearch("")
            setReviewFilter("all")
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>{viewingAssignment?.title || "Assignment Submissions"}</DialogTitle>
            <DialogDescription>
              Review student submissions for this assignment.
            </DialogDescription>
          </DialogHeader>

          {isLoadingSubmissions ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              <Spinner />
              Loading submissions...
            </div>
          ) : submissions.length ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Total submissions</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{submissions.length}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-700">Reviewed</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-900">{reviewedCount}</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-700">Pending review</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-900">{pendingCount}</p>
                </div>
              </div>

              <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_220px]">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Search student</label>
                  <Input
                    value={submissionSearch}
                    onChange={(event) => setSubmissionSearch(event.target.value)}
                    placeholder="Search by student name or email"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Review status</label>
                  <select
                    value={reviewFilter}
                    onChange={(event) => setReviewFilter(event.target.value as "all" | "reviewed" | "pending")}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                  >
                    <option value="all">All submissions</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="pending">Pending review</option>
                  </select>
                </div>
              </div>

              {filteredSubmissions.length ? filteredSubmissions.map((submission) => (
                <div key={submission.id} className="rounded-xl border border-slate-200 p-4">
                  {(() => {
                    const reviewForm = reviewForms[submission.id] || buildReviewFormState(submission)

                    return (
                      <>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-medium text-slate-900">{submission.studentName}</p>
                            <p className="text-sm text-slate-500">{submission.studentEmail}</p>
                          </div>
                          <div className="text-sm sm:text-right">
                            <p className="capitalize text-slate-700">{submission.submissionType}</p>
                            <p>{new Date(submission.updatedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p>
                            <p className={`mt-1 font-medium ${submission.reviewedAt ? "text-emerald-700" : "text-amber-700"}`}>
                              {submission.reviewedAt ? "Reviewed" : "Pending review"}
                            </p>
                          </div>
                        </div>

                        <Accordion type="single" collapsible className="mt-3">
                          <AccordionItem value="preview" className="border-none">
                            <AccordionTrigger className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 hover:no-underline">
                              Preview and Review
                            </AccordionTrigger>
                            <AccordionContent className="pt-3">
                              {submission.textContent ? (
                                <div className="whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-700">
                                  {submission.textContent}
                                </div>
                              ) : null}

                              {submission.fileDataUrl ? (
                                <div className="mt-3 space-y-3">
                                  <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <a
                                      href={submission.fileDataUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      download={submission.fileName || undefined}
                                      className="font-medium text-slate-900 underline underline-offset-4"
                                    >
                                      {submission.fileName || "Open file"}
                                    </a>
                                    <span className="text-slate-500">{submission.fileMimeType}</span>
                                    <span className="text-slate-500">
                                      {submission.fileSizeBytes ? `${Math.max(1, Math.round(submission.fileSizeBytes / 1024))} KB` : ""}
                                    </span>
                                  </div>

                                  {submission.submissionType === "image" ? (
                                    <img
                                      src={submission.fileDataUrl}
                                      alt={submission.fileName || `${submission.studentName} submission`}
                                      className="max-h-96 rounded-lg border border-slate-200 object-contain"
                                    />
                                  ) : submission.submissionType === "pdf" ? (
                                    <iframe
                                      src={submission.fileDataUrl}
                                      title={submission.fileName || `${submission.studentName} PDF submission`}
                                      className="h-96 w-full rounded-lg border border-slate-200"
                                    />
                                  ) : null}
                                </div>
                              ) : null}

                              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                                  <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Score</label>
                                    <Input
                                      type="number"
                                      min="1"
                                      max="10"
                                      value={reviewForm.score}
                                      onChange={(event) => setReviewFormState(submission.id, { score: event.target.value })}
                                      placeholder="1 - 10"
                                    />
                                    <p className="mt-1 text-xs text-slate-500">Use a score from 1 to 10.</p>
                                  </div>
                                  <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Comment</label>
                                    <Textarea
                                      rows={4}
                                      value={reviewForm.adminComment}
                                      onChange={(event) => setReviewFormState(submission.id, { adminComment: event.target.value })}
                                      placeholder="Add feedback for the student"
                                    />
                                  </div>
                                </div>

                                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="text-sm text-slate-500">
                                    {submission.reviewedAt ? (
                                      <span>
                                        Reviewed by {submission.reviewedByName || "Admin"} on{" "}
                                        {new Date(submission.reviewedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                                      </span>
                                    ) : (
                                      <span>Not reviewed yet.</span>
                                    )}
                                  </div>
                                  <Button
                                    type="button"
                                    className="rounded-xl bg-slate-900"
                                    disabled={reviewForm.isSaving}
                                    onClick={() => void saveReview(submission.id)}
                                  >
                                    {reviewForm.isSaving ? <Spinner className="size-4" /> : null}
                                    Save Review
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </>
                    )
                  })()}
                </div>
              )) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                  No submissions match the current search or filter.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              No submissions yet for this assignment.
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setViewingAssignment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
