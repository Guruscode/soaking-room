"use client"

import { useEffect, useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { AcademySettings, SettingsPayload } from "@/lib/types"

const initialFormState: SettingsPayload = {
  academyName: "",
  supportEmail: "",
  timezone: "",
  defaultOnlineLink: "",
  defaultVenue: "",
}

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [formState, setFormState] = useState(initialFormState)
  const [settings, setSettings] = useState<AcademySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  const syncFormWithSettings = (nextSettings: AcademySettings) => {
    setFormState({
      academyName: nextSettings.academyName,
      supportEmail: nextSettings.supportEmail,
      timezone: nextSettings.timezone,
      defaultOnlineLink: nextSettings.defaultOnlineLink,
      defaultVenue: nextSettings.defaultVenue,
    })
  }

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)

      try {
        const response = await fetch("/api/admin/settings", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        })
        const data = (await response.json()) as { data?: AcademySettings; error?: string }

        if (!response.ok || !data.data) {
          throw new Error(data.error || "Failed to load settings.")
        }

        setSettings(data.data)
        syncFormWithSettings(data.data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Settings unavailable",
          description: getErrorMessage(error, "Failed to load settings."),
        })
      } finally {
        setIsLoading(false)
      }
    }

    void loadSettings()
  }, [])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formState),
      })
      const data = (await response.json()) as { data?: AcademySettings; error?: string }

      if (!response.ok || !data.data) {
        throw new Error(data.error || "Failed to update settings.")
      }

      setSettings(data.data)
      syncFormWithSettings(data.data)
      setIsFormModalOpen(false)
      toast({
        title: "Settings updated",
        description: "Academy defaults have been saved.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: getErrorMessage(error, "Failed to update settings."),
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
        <Spinner />
        Loading settings...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Settings</h2>
            <p className="mt-2 text-sm text-slate-600">Manage academy-wide defaults used by broadcasts and student-facing experiences.</p>
          </div>
          <Button
            type="button"
            className="rounded-xl bg-slate-900"
            onClick={() => {
              if (settings) {
                syncFormWithSettings(settings)
              }
              setIsFormModalOpen(true)
            }}
          >
            Edit Settings
          </Button>
        </div>
      </div>

      {settings ? (
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Current Defaults</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Info label="Academy Name" value={settings.academyName} />
            <Info label="Support Email" value={settings.supportEmail} />
            <Info label="Timezone" value={settings.timezone} />
            <Info label="Default Online Link" value={settings.defaultOnlineLink} />
            <Info label="Default Venue" value={settings.defaultVenue} />
            <Info label="Last Updated" value={new Date(settings.updatedAt).toLocaleString("en-NG")} />
          </div>
        </div>
      ) : null}

      <Dialog
        open={isFormModalOpen}
        onOpenChange={(open) => {
          if (!open && settings) {
            syncFormWithSettings(settings)
          }
          setIsFormModalOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Settings</DialogTitle>
            <DialogDescription>Update academy-wide defaults used across the admin and student experience.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="Academy Name" value={formState.academyName} onChange={(value) => setFormState((prev) => ({ ...prev, academyName: value }))} />
            <Field label="Support Email" type="email" value={formState.supportEmail} onChange={(value) => setFormState((prev) => ({ ...prev, supportEmail: value }))} />
            <Field label="Timezone" value={formState.timezone} onChange={(value) => setFormState((prev) => ({ ...prev, timezone: value }))} />
            <Field label="Default Online Link" value={formState.defaultOnlineLink} onChange={(value) => setFormState((prev) => ({ ...prev, defaultOnlineLink: value }))} />
            <div className="md:col-span-2">
              <Field label="Default Venue" value={formState.defaultVenue} onChange={(value) => setFormState((prev) => ({ ...prev, defaultVenue: value }))} />
            </div>
            <DialogFooter className="md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (settings) {
                    syncFormWithSettings(settings)
                  }
                  setIsFormModalOpen(false)
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-slate-900" disabled={isSaving}>
                {isSaving ? <Spinner className="size-4" /> : null}
                Save Settings
              </Button>
            </DialogFooter>
          </form>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-900">{value}</p>
    </div>
  )
}
