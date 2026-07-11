"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"

type MessageItem = {
  id: string
  message: string
  parentId: string | null
  isFromAdmin: boolean
  createdAt: string
}

export default function StudentExamMessagesPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/student/exams/messages", { cache: "no-store", credentials: "include" })
      const json = (await res.json()) as {
        data?: MessageItem[]
        error?: string
      }
      if (res.ok && json.data) {
        setMessages(json.data)
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchMessages()
  }, [fetchMessages])

  const sendMessage = async () => {
    const text = messageInput.trim()
    if (!text) return

    setIsSending(true)

    try {
      const response = await fetch("/api/student/exams/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text }),
      })
      const json = (await response.json()) as { data?: MessageItem; error?: string }

      if (!response.ok || !json.data) {
        throw new Error(json.error || "Failed to send message.")
      }

      setMessages((prev) => [...prev, json.data!])
      setMessageInput("")

      toast({
        title: "Message sent",
        description: "Your message has been sent to the admin.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send",
        description: getErrorMessage(error, "Could not send your message. Please try again."),
      })
    } finally {
      setIsSending(false)
    }
  }

  // Separate top-level messages from replies
  const topLevel = messages.filter((m) => !m.parentId)
  const repliesByParent = new Map<string, MessageItem[]>()
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
        <h2 className="text-2xl font-semibold text-slate-900">💬 Message Admin</h2>
        <p className="mt-1 text-sm text-slate-600">
          Send a message to the exam administrator if you need clarification or assistance. Your name and email will be included.
        </p>
      </div>

      {/* Compose new message */}
      <div className="rounded-xl border border-slate-200 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">New Message</label>
        <Textarea
          rows={4}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message here..."
          className="text-sm"
        />
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
            onClick={sendMessage}
            disabled={isSending || !messageInput.trim()}
          >
            {isSending ? <Spinner className="size-4" /> : null}
            Send Message
          </Button>
        </div>
      </div>

      {/* Conversation thread */}
      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="mb-1 text-lg font-semibold text-slate-900">Conversation</h3>

        {messages.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            No previous messages. Send a message above to start a conversation with the admin.
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {topLevel.map((msg) => {
              const replies = repliesByParent.get(msg.id) || []

              return (
                <div key={msg.id} className="space-y-2">
                  {/* Student's own message */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-500">You</p>
                      <p className="shrink-0 text-xs text-slate-400">
                        {new Date(msg.createdAt).toLocaleString("en-NG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <div className="mt-1 whitespace-pre-wrap rounded-lg bg-white px-3 py-2 text-sm text-slate-900">
                      {msg.message}
                    </div>
                  </div>

                  {/* Admin replies to this message */}
                  {replies.map((reply) => (
                    <div key={reply.id} className="ml-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-indigo-700">Admin Reply</p>
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
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
