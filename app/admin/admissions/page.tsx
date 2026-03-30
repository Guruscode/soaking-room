"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
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
      resetForm()
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
      if (editingId === row.id) resetForm()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: getErrorMessage(error, "Failed to remove student."),
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="text-2xl font-semibold">Admissions CMS</h2>
        <p className="mt-2 text-sm text-slate-600">Create, review, update, approve, reject, and delete student records.</p>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
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
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" className="rounded-xl bg-slate-900" disabled={isSaving}>
              {isSaving ? <Spinner className="size-4" /> : null}
              {editingId ? "Update Student" : "Create Student"}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" className="rounded-xl" onClick={resetForm}>
                Cancel Edit
              </Button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Student Records</h3>
        <div className="mt-3 overflow-x-auto">
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
                  <th className="py-2 pr-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 text-slate-700 align-top">
                    <td className="py-2 pr-4">{row.fullName}</td>
                    <td className="py-2 pr-4">{row.category}</td>
                    <td className="py-2 pr-4">{row.email}</td>
                    <td className="py-2 pr-4 capitalize">{row.admissionStatus}</td>
                    <td className="py-2 pr-2">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(row)}>
                          Edit
                        </Button>
                        {row.admissionStatus !== "approved" ? (
                          <Button type="button" size="sm" onClick={() => updateStatus(row, "approved")}>
                            Approve
                          </Button>
                        ) : null}
                        {row.admissionStatus !== "rejected" ? (
                          <Button type="button" variant="outline" size="sm" onClick={() => updateStatus(row, "rejected")}>
                            Reject
                          </Button>
                        ) : null}
                        <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(row)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
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
