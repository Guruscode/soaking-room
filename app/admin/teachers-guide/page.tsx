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
import { getErrorMessage } from "@/lib/errors"
import type { TeachersGuideItem, TeachersGuidePayload } from "@/lib/types"

const initialFormState: TeachersGuidePayload = {
  title: "",
  owner: "",
  duration: "",
  content: "",
}

export default function AdminTeachersGuidePage() {
  const { toast } = useToast()
  const [rows, setRows] = useState<TeachersGuideItem[]>([])
  const [formState, setFormState] = useState(initialFormState)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  useEffect(() => {
    const loadRows = async () => {
      setIsLoading(true)

      try {
        const response = await fetch("/api/admin/teachers-guides", { cache: "no-store", credentials: "include" })
        const data = (await response.json()) as { data?: TeachersGuideItem[]; error?: string }

        if (!response.ok) {
          throw new Error(data.error || "Failed to load teachers guides.")
        }

        setRows(data.data || [])
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Teachers guides unavailable",
          description: getErrorMessage(error, "Failed to load teachers guides."),
        })
      } finally {
        setIsLoading(false)
      }
    }

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
      const response = await fetch(editingId ? `/api/admin/teachers-guides/${editingId}` : "/api/admin/teachers-guides", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formState),
      })
      const data = (await response.json()) as { data?: TeachersGuideItem; error?: string }

      if (!response.ok || !data.data) {
        throw new Error(data.error || "Failed to save teachers guide.")
      }

      setRows((prev) => (editingId ? prev.map((row) => (row.id === editingId ? data.data! : row)) : [data.data!, ...prev]))
      toast({
        title: editingId ? "Guide updated" : "Guide created",
        description: `${data.data.title} has been saved.`,
      })
      closeFormModal()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: getErrorMessage(error, "Failed to save teachers guide."),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const onEdit = (item: TeachersGuideItem) => {
    setEditingId(item.id)
    setFormState({
      title: item.title,
      owner: item.owner,
      duration: item.duration,
      content: item.content,
    })
    setIsFormModalOpen(true)
  }

  const onDelete = async (item: TeachersGuideItem) => {
    try {
      const response = await fetch(`/api/admin/teachers-guides/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete teachers guide.")
      }

      setRows((prev) => prev.filter((row) => row.id !== item.id))
      toast({
        title: "Guide deleted",
        description: `${item.title} has been removed.`,
      })
      if (editingId === item.id) closeFormModal()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: getErrorMessage(error, "Failed to delete teachers guide."),
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Teachers Guide CMS</h2>
            <p className="mt-2 text-sm text-slate-600">Manage teaching flows, ownership, and lesson guidance.</p>
          </div>
          <Button type="button" className="rounded-xl bg-slate-900" onClick={openCreateModal}>
            Add Guide
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Teaching Guide Table</h3>
          <p className="text-sm text-slate-500">{rows.length} total</p>
        </div>
        <div className="mt-3 space-y-3 md:hidden">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              <Spinner />
              Loading teachers guides...
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{row.title}</p>
                    <p className="text-sm text-slate-500">{row.owner}</p>
                  </div>
                  <AdminRowActions
                    recordName={row.title}
                    onEdit={() => onEdit(row)}
                    onDelete={() => onDelete(row)}
                  />
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-800">Duration:</span> {row.duration}</p>
                  <p><span className="font-medium text-slate-800">Content:</span> {row.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-3 hidden overflow-x-auto md:block">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              <Spinner />
              Loading teachers guides...
            </div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Owner</th>
                  <th className="py-2 pr-4 font-medium">Duration</th>
                  <th className="py-2 pr-4 font-medium">Content</th>
                  <th className="py-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 text-slate-700 align-top">
                    <td className="py-2 pr-4">{row.title}</td>
                    <td className="py-2 pr-4">{row.owner}</td>
                    <td className="py-2 pr-4">{row.duration}</td>
                    <td className="py-2 pr-4">{row.content}</td>
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
            <DialogTitle>{editingId ? "Edit Guide" : "Add Guide"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update this teachers guide." : "Create a new teachers guide."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <Input value={formState.title} onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Owner</label>
              <Input value={formState.owner} onChange={(event) => setFormState((prev) => ({ ...prev, owner: event.target.value }))} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Duration</label>
              <Input value={formState.duration} onChange={(event) => setFormState((prev) => ({ ...prev, duration: event.target.value }))} required />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
              <Textarea rows={6} value={formState.content} onChange={(event) => setFormState((prev) => ({ ...prev, content: event.target.value }))} required />
            </div>
            <DialogFooter className="md:col-span-2">
              <Button type="button" variant="outline" onClick={closeFormModal} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-slate-900" disabled={isSaving}>
                {isSaving ? <Spinner className="size-4" /> : null}
                {editingId ? "Update Guide" : "Create Guide"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
