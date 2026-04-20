"use client"

import { useEffect, useState } from "react"
import { AdminRowActions } from "@/components/admin-row-actions"
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
import { STUDENT_CATEGORY_OPTIONS } from "@/lib/academy-options"
import { getErrorMessage } from "@/lib/errors"
import type { AcademyUser, AdminStudentPayload, AdmissionStatus } from "@/lib/types"

const initialFormState: AdminStudentPayload = {
  fullName: "",
  dateOfBirthOrAge: "",
  category: "",
  location: "",
  email: "",
  phone: "",
  bornAgain: "Yes",
  church: "",
  musicalSkill: "",
  reason: "",
  admissionStatus: "pending",
  password: "",
}

export default function AdminAdmissionsPage() {
  const { toast } = useToast()
  const [rows, setRows] = useState<AcademyUser[]>([])
  const [formState, setFormState] = useState(initialFormState)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportStartDate, setExportStartDate] = useState("")
  const [exportEndDate, setExportEndDate] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const loadAdmissions = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/admissions", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })
      const data = (await response.json()) as { data?: AcademyUser[]; error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Failed to load admissions.")
      }

      setRows(data.data || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Admissions unavailable",
        description: getErrorMessage(error, "Failed to load admissions."),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadAdmissions()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormState(initialFormState)
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
      const payload = editingId ? { ...formState, password: formState.password || undefined } : formState

      const response = await fetch(editingId ? `/api/admin/admissions/${editingId}` : "/api/admin/admissions", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as { data?: AcademyUser; error?: string }

      if (!response.ok || !data.data) {
        throw new Error(data.error || "Failed to save student.")
      }

      setRows((prev) => (editingId ? prev.map((row) => (row.id === editingId ? data.data! : row)) : [data.data!, ...prev]))
      toast({
        title: editingId ? "Student updated" : "Student created",
        description: `${data.data.fullName} has been saved.`,
      })
      closeFormModal()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: getErrorMessage(error, "Failed to save student record."),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const onEdit = (row: AcademyUser) => {
    setEditingId(row.id)
    setFormState({
      fullName: row.fullName,
      dateOfBirthOrAge: row.dateOfBirthOrAge,
      category: row.category,
      location: row.location,
      email: row.email,
      phone: row.phone,
      bornAgain: row.bornAgain,
      church: row.church || "",
      musicalSkill: row.musicalSkill || "",
      reason: row.reason,
      admissionStatus: row.admissionStatus,
      password: "",
    })
    setIsFormModalOpen(true)
  }

  const updateStatus = async (row: AcademyUser, status: AdmissionStatus) => {
    try {
      const response = await fetch(`/api/admin/admissions/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ admissionStatus: status }),
      })
      const data = (await response.json()) as { data?: AcademyUser; error?: string }

      if (!response.ok || !data.data) {
        throw new Error(data.error || "Failed to update admission status.")
      }

      setRows((prev) => prev.map((item) => (item.id === row.id ? data.data! : item)))
      toast({
        title: "Admission updated",
        description: `${row.fullName} is now ${status}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Status update failed",
        description: getErrorMessage(error, "Failed to update admission status."),
      })
    }
  }

  const onDelete = async (row: AcademyUser) => {
    try {
      const response = await fetch(`/api/admin/admissions/${row.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove student.")
      }

      setRows((prev) => prev.filter((item) => item.id !== row.id))
      toast({
        title: "Student removed",
        description: `${row.fullName} has been deleted.`,
      })
      if (editingId === row.id) closeFormModal()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: getErrorMessage(error, "Failed to remove student."),
      })
    }
  }

  const onExportAdmissions = async () => {
    if (!exportStartDate || !exportEndDate) {
      toast({
        variant: "destructive",
        title: "Date range required",
        description: "Choose both the start date and end date before exporting.",
      })
      return
    }

    if (exportStartDate > exportEndDate) {
      toast({
        variant: "destructive",
        title: "Invalid date range",
        description: "The start date cannot be after the end date.",
      })
      return
    }

    setIsExporting(true)

    try {
      const params = new URLSearchParams({
        format: "csv",
        startDate: exportStartDate,
        endDate: exportEndDate,
      })

      const response = await fetch(`/api/admin/admissions?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        let message = "Failed to export admissions."

        try {
          const data = (await response.json()) as { error?: string }
          message = data.error || message
        } catch {
          // Ignore non-JSON error payloads and fall back to the default message.
        }

        throw new Error(message)
      }

      const csvBlob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(csvBlob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `admissions-${exportStartDate}-to-${exportEndDate}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      setIsExportModalOpen(false)
      toast({
        title: "Admissions exported",
        description: `Student records from ${exportStartDate} to ${exportEndDate} have been downloaded.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: getErrorMessage(error, "Failed to export admissions."),
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Admissions CMS</h2>
            <p className="mt-2 text-sm text-slate-600">Create, review, update, approve, reject, and delete student records.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="rounded-xl bg-slate-900" onClick={openCreateModal}>
              Add Admission
            </Button>
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsExportModalOpen(true)}>
              Export Students
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Student Records</h3>
          <p className="text-sm text-slate-500">{rows.length} total</p>
        </div>
        <div className="mt-3 space-y-3 md:hidden">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              <Spinner />
              Loading admissions...
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{row.fullName}</p>
                    <p className="text-sm text-slate-500">{row.email}</p>
                  </div>
                  <AdminRowActions
                    recordName={row.fullName}
                    onEdit={() => onEdit(row)}
                    onDelete={() => onDelete(row)}
                    onApprove={() => updateStatus(row, "approved")}
                    onReject={() => updateStatus(row, "rejected")}
                    canApprove={row.admissionStatus !== "approved"}
                    canReject={row.admissionStatus !== "rejected"}
                  />
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-800">Category:</span> {row.category}</p>
                  <p><span className="font-medium text-slate-800">Status:</span> <span className="capitalize">{row.admissionStatus}</span></p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-3 hidden overflow-x-auto md:block">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              <Spinner />
              Loading admissions...
            </div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 text-slate-700 align-top">
                    <td className="py-2 pr-4">{row.fullName}</td>
                    <td className="py-2 pr-4">{row.category}</td>
                    <td className="py-2 pr-4">{row.email}</td>
                    <td className="py-2 pr-4 capitalize">{row.admissionStatus}</td>
                    <td className="py-2 text-right">
                      <div className="flex justify-end">
                        <AdminRowActions
                          recordName={row.fullName}
                          onEdit={() => onEdit(row)}
                          onDelete={() => onDelete(row)}
                          onApprove={() => updateStatus(row, "approved")}
                          onReject={() => updateStatus(row, "rejected")}
                          canApprove={row.admissionStatus !== "approved"}
                          canReject={row.admissionStatus !== "rejected"}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Admission" : "Add Admission"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update this student record." : "Create a new student admission record."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name" value={formState.fullName} onChange={(value) => setFormState((prev) => ({ ...prev, fullName: value }))} />
            <Field label="Date of Birth / Age" value={formState.dateOfBirthOrAge} onChange={(value) => setFormState((prev) => ({ ...prev, dateOfBirthOrAge: value }))} />
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
              <select
                value={formState.category}
                onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                required
              >
                <option value="">Select category</option>
                {STUDENT_CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Location" value={formState.location} onChange={(value) => setFormState((prev) => ({ ...prev, location: value }))} />
            <Field label="Email" type="email" value={formState.email} onChange={(value) => setFormState((prev) => ({ ...prev, email: value }))} />
            <Field label="Phone" value={formState.phone} onChange={(value) => setFormState((prev) => ({ ...prev, phone: value }))} />
            <Field label="Church / Fellowship" value={formState.church || ""} onChange={(value) => setFormState((prev) => ({ ...prev, church: value }))} />
            <Field label="Musical Skill" value={formState.musicalSkill || ""} onChange={(value) => setFormState((prev) => ({ ...prev, musicalSkill: value }))} />
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Born Again</label>
              <select
                value={formState.bornAgain}
                onChange={(event) => setFormState((prev) => ({ ...prev, bornAgain: event.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Admission Status</label>
              <select
                value={formState.admissionStatus}
                onChange={(event) => setFormState((prev) => ({ ...prev, admissionStatus: event.target.value as AdmissionStatus }))}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {editingId ? "New Password (optional)" : "Password"}
              </label>
              <Input
                type="password"
                value={formState.password || ""}
                onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                required={!editingId}
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Reason</label>
              <Textarea rows={4} value={formState.reason} onChange={(event) => setFormState((prev) => ({ ...prev, reason: event.target.value }))} required />
            </div>
            <DialogFooter className="md:col-span-2">
              <Button type="button" variant="outline" onClick={closeFormModal} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-slate-900" disabled={isSaving}>
                {isSaving ? <Spinner className="size-4" /> : null}
                {editingId ? "Update Student" : "Create Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Student Details</DialogTitle>
            <DialogDescription>
              Download admissions as a CSV for students created between the selected dates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Start Date</label>
              <Input type="date" value={exportStartDate} onChange={(event) => setExportStartDate(event.target.value)} max={exportEndDate || undefined} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">End Date</label>
              <Input type="date" value={exportEndDate} onChange={(event) => setExportEndDate(event.target.value)} min={exportStartDate || undefined} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsExportModalOpen(false)} disabled={isExporting}>
              Cancel
            </Button>
            <Button type="button" className="rounded-xl bg-slate-900" onClick={onExportAdmissions} disabled={isExporting}>
              {isExporting ? <Spinner className="size-4" /> : null}
              Export CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} required />
    </div>
  )
}
