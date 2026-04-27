"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { AssignmentItem, AssignmentSubmissionPayload, AssignmentSubmissionType } from "@/lib/types"

type AssignmentFormState = AssignmentSubmissionPayload & {
  isSaving: boolean
}

function buildInitialFormState(assignment: AssignmentItem): AssignmentFormState {
  return {
    submissionType: assignment.submission?.submissionType || "text",
    textContent: assignment.submission?.textContent || "",
    fileName: assignment.submission?.fileName || "",
    fileMimeType: assignment.submission?.fileMimeType || "",
    fileDataUrl: assignment.submission?.fileDataUrl || "",
    isSaving: false,
  }
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(new Error("Failed to read the selected file."))
    reader.readAsDataURL(file)
  })
}

export function StudentAssignmentsClient({ assignments: initialAssignments }: { assignments: AssignmentItem[] }) {
  const { toast } = useToast()
  const [assignments, setAssignments] = useState(initialAssignments)
  const [forms, setForms] = useState<Record<string, AssignmentFormState>>(() =>
    Object.fromEntries(initialAssignments.map((assignment) => [assignment.id, buildInitialFormState(assignment)])),
  )

  const setFormState = (assignmentId: string, update: Partial<AssignmentFormState>) => {
    setForms((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        ...update,
      },
    }))
  }

  const onSubmit = async (assignmentId: string) => {
    const form = forms[assignmentId]

    if (!form) {
      return
    }

    setFormState(assignmentId, { isSaving: true })

    try {
      const payload: AssignmentSubmissionPayload =
        form.submissionType === "text"
          ? {
              submissionType: "text",
              textContent: form.textContent || "",
            }
          : {
              submissionType: form.submissionType,
              fileName: form.fileName || "",
              fileMimeType: form.fileMimeType || "",
              fileDataUrl: form.fileDataUrl || "",
            }

      const response = await fetch(`/api/student/assignments/${assignmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as { data?: AssignmentItem["submission"]; error?: string }

      if (!response.ok || !data.data) {
        throw new Error(data.error || "Failed to submit assignment.")
      }

      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === assignmentId
            ? {
                ...assignment,
                submission: data.data,
              }
            : assignment,
        ),
      )
      setForms((prev) => ({
        ...prev,
        [assignmentId]: {
          ...prev[assignmentId],
          isSaving: false,
          textContent: data.data?.textContent || prev[assignmentId].textContent,
          fileName: data.data?.fileName || prev[assignmentId].fileName,
          fileMimeType: data.data?.fileMimeType || prev[assignmentId].fileMimeType,
          fileDataUrl: data.data?.fileDataUrl || prev[assignmentId].fileDataUrl,
        },
      }))
      toast({
        title: "Assignment submitted",
        description: "Your work has been saved and is now visible to the admin team.",
      })
    } catch (error) {
      setFormState(assignmentId, { isSaving: false })
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: getErrorMessage(error, "Failed to submit assignment."),
      })
      return
    }

    setFormState(assignmentId, { isSaving: false })
  }

  const onSubmissionTypeChange = (assignmentId: string, submissionType: AssignmentSubmissionType) => {
    setFormState(assignmentId, {
      submissionType,
      textContent: submissionType === "text" ? forms[assignmentId]?.textContent || "" : "",
      fileName: submissionType === "text" ? "" : forms[assignmentId]?.fileName || "",
      fileMimeType: submissionType === "text" ? "" : forms[assignmentId]?.fileMimeType || "",
      fileDataUrl: submissionType === "text" ? "" : forms[assignmentId]?.fileDataUrl || "",
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-2xl font-semibold">Assignments</h2>
        <p className="mt-2 text-sm text-slate-600">
          Review each assignment, choose how you want to submit it, and send it directly to the admin team.
        </p>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => {
          const form = forms[assignment.id]

          return (
            <div key={assignment.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{assignment.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Due {new Date(assignment.dueDate).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                  {assignment.submission ? "Submitted" : "Not submitted"}
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{assignment.instructions}</p>

              {assignment.submission ? (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <p className="font-medium">
                    Last submitted {new Date(assignment.submission.updatedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  <p className="mt-1 capitalize">Method: {assignment.submission.submissionType}</p>
                  <p className="mt-1">
                    Score: {assignment.submission.score ?? "Pending"}
                  </p>
                  {assignment.submission.textContent ? (
                    <p className="mt-2 whitespace-pre-wrap text-emerald-950">{assignment.submission.textContent}</p>
                  ) : null}
                  {assignment.submission.fileDataUrl ? (
                    <div className="mt-2 space-y-3">
                      <a
                        href={assignment.submission.fileDataUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={assignment.submission.fileName || undefined}
                        className="inline-block text-sm font-medium text-emerald-700 underline underline-offset-4"
                      >
                        Open current file
                      </a>
                      {assignment.submission.submissionType === "image" ? (
                        <img
                          src={assignment.submission.fileDataUrl}
                          alt={assignment.submission.fileName || `${assignment.title} submission`}
                          className="max-h-80 rounded-lg border border-emerald-200 object-contain"
                        />
                      ) : assignment.submission.submissionType === "pdf" ? (
                        <iframe
                          src={assignment.submission.fileDataUrl}
                          title={assignment.submission.fileName || `${assignment.title} PDF`}
                          className="h-80 w-full rounded-lg border border-emerald-200"
                        />
                      ) : null}
                    </div>
                  ) : null}
                  {assignment.submission.adminComment ? (
                    <div className="mt-3 rounded-lg border border-emerald-300 bg-white/70 px-3 py-3 text-emerald-950">
                      <p className="font-medium">Admin Comment</p>
                      <p className="mt-1 whitespace-pre-wrap">{assignment.submission.adminComment}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-4 grid gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Submission Method</label>
                  <select
                    value={form.submissionType}
                    onChange={(event) => onSubmissionTypeChange(assignment.id, event.target.value as AssignmentSubmissionType)}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                {form.submissionType === "text" ? (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Submission Text</label>
                    <Textarea
                      rows={6}
                      value={form.textContent || ""}
                      onChange={(event) => setFormState(assignment.id, { textContent: event.target.value })}
                      placeholder="Write your answer here"
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Upload {form.submissionType === "image" ? "Image" : "PDF"}
                    </label>
                    <Input
                      type="file"
                      accept={form.submissionType === "image" ? "image/*" : "application/pdf"}
                      onChange={async (event) => {
                        const file = event.target.files?.[0]

                        if (!file) {
                          return
                        }

                        try {
                          const fileDataUrl = await fileToDataUrl(file)
                          setFormState(assignment.id, {
                            fileName: file.name,
                            fileMimeType: file.type,
                            fileDataUrl,
                          })
                        } catch (error) {
                          toast({
                            variant: "destructive",
                            title: "File error",
                            description: getErrorMessage(error, "Failed to read the selected file."),
                          })
                        }
                      }}
                    />
                    <p className="text-xs text-slate-500">
                      Maximum file size is 5MB.
                      {form.fileName ? ` Current file: ${form.fileName}` : ""}
                    </p>
                  </div>
                )}

                <div>
                  <Button
                    type="button"
                    className="rounded-xl bg-slate-900"
                    disabled={form.isSaving}
                    onClick={() => void onSubmit(assignment.id)}
                  >
                    {form.isSaving ? <Spinner className="size-4" /> : null}
                    {assignment.submission ? "Update Submission" : "Submit Assignment"}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
