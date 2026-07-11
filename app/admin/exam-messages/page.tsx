"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import type { ExamMessage } from "@/lib/types"

function ReplyInput({
  parentId,
  onReply,
}: {
  parentId: string
  onReply: (msg: ExamMessage) => void
}) {
  const { toast } = useToast()
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)

  const sendReply = async () => {
    const content = text.trim()
    if (!content) return

    setSending(true)

    try {
      const res = await fetch("/api/admin/exams/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ parentId, message: content }),
      })
      const json = (await res.json()) as { data?: ExamMessage; error?: string }

      if (!res.ok || !json.data) {
        throw new Error(json.error || "Failed to send reply.")
      }

      onReply(json.data)
      setText("")

      toast({
        title: "Reply sent",
        description: "Your reply has been sent to the student.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send",
        description: getErrorMessage(error, "Could not send your reply."),
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="ml-6 flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your reply..."
        className="text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            void sendReply()
          }
        }}
      />
      <Button
        type="button"
        size="sm"
        className="rounded-lg shrink-0 bg-indigo-600 hover:bg-indigo-700"
        disabled={sending || !text.trim()}
        onClick={sendReply}
      >
        {sending ? <Spinner className="size-3" /> : "Reply"}
      </Button>
    </div>
  )
}

export default function AdminExamMessagesPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ExamMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadMessages = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/exams/messages", { cache: "no-store", credentials: "include" })
      const json = (await response.json()) as { data?: ExamMessage[]; error?: string }

      if (!response.ok) {
        throw new Error(json.error || "Failed to load messages.")
      }

      setMessages(json.data || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Messages unavailable",
        description: getErrorMessage(error, "Failed to load messages."),
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void loadMessages()
  }, [loadMessages])

  // Separate top-level messages from replies
  const topLevel = messages.filter((m) => !m.parentId)
  const repliesByParent = new Map<string, ExamMessage[]>()
  for (const m of messages) {
    if (m.parentId) {
      const existing = repliesByParent.get(m.parentId) || []
      existing.push(m)
      repliesByParent.set(m.parentId, existing)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
        <Spinner />
        Loading messages...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">💬 Exam Messages</h2>
            <p className="mt-1 text-sm text-slate-600">
              View and reply to messages from students.
              {messages.length > 0 ? (
                <span className="ml-1 text-slate-500">({messages.length} total messages)</span>
              ) : null}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => void loadMessages()}
          >
            <svg className="mr-1.5 size-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Messages list */}
      <div className="rounded-xl border border-slate-200 p-4">
        {messages.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No messages from students yet.
          </div>
        ) : (
          <div className="space-y-3">
            {topLevel.map((msg) => {
              const replies = repliesByParent.get(msg.id) || []

              return (
                <div key={msg.id} className="space-y-2">
                  {/* Student message */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{msg.studentName}</p>
                        <p className="text-xs text-slate-500">{msg.studentEmail}</p>
                      </div>
                      <p className="shrink-0 text-xs text-slate-400">
                        {new Date(msg.createdAt).toLocaleString("en-NG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <div className="mt-2 whitespace-pre-wrap rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
                      {msg.message}
                    </div>
                  </div>

                  {/* Admin replies */}
                  {replies.map((reply) => (
                    <div key={reply.id} className="ml-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-indigo-700">Admin reply</p>
                        <p className="shrink-0 text-xs text-indigo-400">
                          {new Date(reply.createdAt).toLocaleString("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <div className="mt-1 whitespace-pre-wrap rounded-lg bg-white px-3 py-2 text-sm text-indigo-900">
                        {reply.message}
                      </div>
                    </div>
                  ))}

                  {/* Reply input */}
                  <ReplyInput
                    parentId={msg.id}
                    onReply={(newMsg) => {
                      setMessages((prev) => [...prev, newMsg])
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
