"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type AdminRowActionsProps = {
  recordName: string
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onApprove?: () => void
  onReject?: () => void
  canApprove?: boolean
  canReject?: boolean
}

export function AdminRowActions({
  recordName,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  canApprove = false,
  canReject = false,
}: AdminRowActionsProps) {
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" className="rounded-full">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {onView ? <DropdownMenuItem onClick={onView}>View</DropdownMenuItem> : null}
          {onEdit ? <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem> : null}
          {canApprove && onApprove ? <DropdownMenuItem onClick={onApprove}>Approve</DropdownMenuItem> : null}
          {canReject && onReject ? <DropdownMenuItem onClick={onReject}>Reject</DropdownMenuItem> : null}
          {onDelete ? (
            <>
              {(onView || onEdit || canApprove || canReject) ? <DropdownMenuSeparator /> : null}
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(event) => event.preventDefault()}
                >
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {recordName}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The record will be removed permanently.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </AlertDialog>
  )
}
