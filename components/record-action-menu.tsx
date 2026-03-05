"use client"

import { useMemo, useState } from "react"

type ActionType = "view" | "edit" | "delete" | "approve" | "reject"

export function RecordActionMenu({
  recordName,
  status,
  showApproval = false,
  onApprove,
  onReject,
  onDelete,
  onEdit,
}: {
  recordName: string
  status?: string
  showApproval?: boolean
  onApprove?: () => void
  onReject?: () => void
  onDelete?: () => void
  onEdit?: (note: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeAction, setActiveAction] = useState<ActionType | null>(null)
  const [editValue, setEditValue] = useState("")

  const actionTitle = useMemo(() => {
    if (!activeAction) return ""
    if (activeAction === "view") return `View ${recordName}`
    if (activeAction === "edit") return `Edit ${recordName}`
    if (activeAction === "delete") return `Delete ${recordName}`
    if (activeAction === "approve") return `Approve ${recordName}`
    return `Reject ${recordName}`
  }, [activeAction, recordName])

  const openAction = (action: ActionType) => {
    setMenuOpen(false)
    setActiveAction(action)
    if (action === "edit") setEditValue("")
  }

  const closeModal = () => setActiveAction(null)

  const confirmAction = () => {
    if (activeAction === "approve") onApprove?.()
    if (activeAction === "reject") onReject?.()
    if (activeAction === "delete") onDelete?.()
    if (activeAction === "edit") onEdit?.(editValue)
    closeModal()
  }

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
        >
          ...
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-20 mt-1 w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
            <button onClick={() => openAction("view")} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100">View</button>
            <button onClick={() => openAction("edit")} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100">Edit</button>
            {showApproval && status !== "Approved" && (
              <button onClick={() => openAction("approve")} className="block w-full rounded px-2 py-1 text-left text-xs text-emerald-700 hover:bg-emerald-50">Approve</button>
            )}
            {showApproval && status !== "Rejected" && (
              <button onClick={() => openAction("reject")} className="block w-full rounded px-2 py-1 text-left text-xs text-amber-700 hover:bg-amber-50">Reject</button>
            )}
            <button onClick={() => openAction("delete")} className="block w-full rounded px-2 py-1 text-left text-xs text-red-600 hover:bg-red-50">Delete</button>
          </div>
        )}
      </div>

      {activeAction && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <h4 className="text-base font-semibold text-slate-900">{actionTitle}</h4>

            {activeAction === "view" && (
              <p className="mt-2 text-sm text-slate-600">This opens details for <span className="font-medium">{recordName}</span>.</p>
            )}

            {activeAction === "edit" && (
              <div className="mt-2">
                <label className="mb-1 block text-xs text-slate-600">Edit note / update</label>
                <textarea
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Enter update..."
                />
              </div>
            )}

            {activeAction === "delete" && (
              <p className="mt-2 text-sm text-slate-600">This will remove <span className="font-medium">{recordName}</span> from the list.</p>
            )}

            {activeAction === "approve" && (
              <p className="mt-2 text-sm text-slate-600">Approve <span className="font-medium">{recordName}</span> and mark as approved.</p>
            )}

            {activeAction === "reject" && (
              <p className="mt-2 text-sm text-slate-600">Reject <span className="font-medium">{recordName}</span> and mark as rejected.</p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeModal} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700">Cancel</button>
              <button
                onClick={activeAction === "view" ? closeModal : confirmAction}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white"
              >
                {activeAction === "view" ? "Close" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
