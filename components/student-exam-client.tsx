"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/errors"
import { useExamProctoring } from "@/hooks/use-exam-proctoring"
import type { ExamAnswerItem, ExamConfig, ExamQuestion } from "@/lib/types"
import { Camera } from "lucide-react"

type ExamData = {
  config: ExamConfig
  questions: ExamQuestion[]
  answer: ExamAnswerItem | null
}

export function StudentExamClient({ initialData }: { initialData: ExamData }) {
  const { toast } = useToast()
  const [data, setData] = useState<ExamData>(initialData)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [examEndedByAdmin, setExamEndedByAdmin] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [proctoringSubmissionInProgress, setProctoringSubmissionInProgress] = useState(false)
  const [isStartingExam, setIsStartingExam] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const answersRef = useRef(answers)
  const dataRef = useRef(data)
  const isSubmittingRef = useRef(false)
  const examEndedByAdminRef = useRef(false)
  const savesInFlightRef = useRef(0)
  const oneMinuteAlertedRef = useRef(false)
  const onProctoringLostRef = useRef(() => {})

  const playBeep = () => {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.value = 880
      gain.gain.value = 0.3
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
      osc.start()
      osc.stop(ctx.currentTime + 0.8)
    } catch {
      // Audio not available — silently skip
    }
  }

  // Keep refs in sync
  useEffect(() => { answersRef.current = answers }, [answers])
  useEffect(() => { dataRef.current = data }, [data])
  useEffect(() => { isSubmittingRef.current = isSubmitting }, [isSubmitting])
  useEffect(() => { examEndedByAdminRef.current = examEndedByAdmin }, [examEndedByAdmin])

  const examActive = data.config.status === "active" && data.answer !== null && !data.answer.isSubmitted
  const examSubmitted = data.answer?.isSubmitted
  // Proctoring is required when the exam config says so, the exam is active,
  // and the exam hasn't been submitted yet. This is independent of whether
  // the exam has actually started (answer exists) — the consent screen
  // should show even before the exam timer begins.
  const proctoringRequired = data.config.requiresProctoring && data.config.status === "active" && !examSubmitted

  // Proctoring hook
  const proctoringHook = useExamProctoring({
    isExamActive: examActive,
    onProctoringLost: onProctoringLostRef.current,
  })

  const {
    state: proctoringState,
    startProctoring,
    stopProctoring,
  } = proctoringHook

  // Clean up proctoring when exam is submitted
  // Note: proctoringRequired becomes false when examSubmitted becomes true,
  // so we check examSubmitted directly instead of combining them.
  useEffect(() => {
    if (examSubmitted) {
      stopProctoring()
    }
  }, [examSubmitted, stopProctoring])

  // Initialize answers from saved state
  useEffect(() => {
    if (data.answer && data.answer.answers) {
      try {
        const savedAnswers = JSON.parse(data.answer.answers) as Array<{ questionId: string; answer: string }>
        const answerMap: Record<string, string> = {}
        for (const item of savedAnswers) {
          answerMap[item.questionId] = item.answer
        }
        setAnswers(answerMap)
        // Update ref immediately so timer auto-submit on first tick has the data
        answersRef.current = answerMap
      } catch {
        // Answers will be empty
      }
    }
  }, [data.answer])

  // Save answers to server (draft, does NOT finalize submission)
  const saveAnswers = useCallback(async (answerData: Record<string, string>): Promise<boolean> => {
    const current = dataRef.current
    if (!current.answer || current.answer.isSubmitted) return false

    savesInFlightRef.current++
    setIsSaving(true)

    try {
      const answerArray = Object.entries(answerData).map(([questionId, answer]) => ({
        questionId,
        answer,
      }))

      const res = await fetch("/api/student/exams/save-draft", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          examAnswerId: current.answer.id,
          answers: answerArray,
        }),
      })

      if (res.ok) {
        setLastSavedAt(new Date())
      }

      return res.ok
    } catch {
      return false
    } finally {
      savesInFlightRef.current--
      setIsSaving(savesInFlightRef.current > 0)
    }
  }, [])

  // Debounced auto-save on answer changes (saves 3 seconds after last change)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!examActive) return

    // Clear previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current)

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      void saveAnswers(answersRef.current)
    }, 3000)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [answers, examActive, saveAnswers])

  // Periodic auto-save every 30 seconds
  useEffect(() => {
    if (!examActive) return

    const interval = setInterval(() => {
      void saveAnswers(answersRef.current)
    }, 30_000)

    return () => clearInterval(interval)
  }, [examActive, saveAnswers])

  // Helper to build the save-draft blob (used by all save-on-exit mechanisms)
  const buildSaveBlob = useCallback(() => {
    const currentData = dataRef.current
    const currentAnswers = answersRef.current
    if (!currentData.answer || currentData.answer.isSubmitted) return null

    const answerArray = Object.entries(currentAnswers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }))

    return new Blob(
      [JSON.stringify({ examAnswerId: currentData.answer.id, answers: answerArray })],
      { type: "application/json" },
    )
  }, [])

  // beforeunload handler — save draft when tab/browser is closed
  useEffect(() => {
    if (!examActive) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const blob = buildSaveBlob()
      if (!blob) return

      navigator.sendBeacon("/api/student/exams/save-draft", blob)

      // Set returnValue to ensure the browser shows the confirmation dialog
      // and gives the beacon time to complete
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [examActive, buildSaveBlob])

  // visibilitychange handler — save when tab becomes hidden (covers closing, tab switch, phone call, etc.)
  useEffect(() => {
    if (!examActive) return

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return

      const currentData = dataRef.current
      const currentAnswers = answersRef.current
      const answerRecord = currentData.answer
      if (!answerRecord || answerRecord.isSubmitted) return

      // Use fetch instead of sendBeacon here because we have time during visibility change
      const answerArray = Object.entries(currentAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }))

      const payload = JSON.stringify({
        examAnswerId: answerRecord.id,
        answers: answerArray,
      })

      fetch("/api/student/exams/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        keepalive: true,
        body: payload,
      }).catch(() => {
        // Fallback to sendBeacon if fetch fails
        const blob = new Blob([payload], { type: "application/json" })
        navigator.sendBeacon("/api/student/exams/save-draft", blob)
      })
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [examActive])

  // Save on component unmount — catches SPA navigation (page changes within the app)
  useEffect(() => {
    return () => {
      const blob = buildSaveBlob()
      if (blob) {
        navigator.sendBeacon("/api/student/exams/save-draft", blob)
      }
    }
  }, [buildSaveBlob])

  // Poll for exam status changes (admin stops/starts exam)
  useEffect(() => {
    if (!data.answer || examSubmitted) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/student/exams/status", { cache: "no-store", credentials: "include" })
        const json = (await res.json()) as { data?: { status: string }; error?: string }

        if (!res.ok || !json.data) return

        if (json.data.status !== "active") {
          // Admin stopped the exam → save draft and show ended state
          await saveAnswers(answersRef.current)

          setExamEndedByAdmin(true)

          setData((prev) => ({
            ...prev,
            config: { ...prev.config, status: "inactive" },
          }))
        } else if (examEndedByAdminRef.current) {
          // Admin restarted the exam → allow student to continue
          setExamEndedByAdmin(false)

          setData((prev) => ({
            ...prev,
            config: { ...prev.config, status: "active" },
          }))
        }
      } catch {
        // Silently fail polling
      }
    }, 30_000)

    return () => clearInterval(interval)
  }, [data.answer, examSubmitted, saveAnswers])

  // Define the proctoring-lost handler and update the ref so the hook sees it
  const handleProctoringLost = useCallback(() => {
    if (proctoringSubmissionInProgress) return
    setProctoringSubmissionInProgress(true)

    toast({
      variant: "destructive",
      title: "🛑 Proctoring lost!",
      description: "Camera monitoring was interrupted. Your exam will be submitted automatically.",
    })

    void (async () => {
      const currentData = dataRef.current
      const currentAnswers = answersRef.current

      if (!currentData.answer || isSubmittingRef.current) return

      setIsSubmitting(true)

      try {
        const answerArray = Object.entries(currentAnswers).map(([questionId, answer]) => ({
          questionId,
          answer,
        }))

        const response = await fetch("/api/student/exams/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            examAnswerId: currentData.answer.id,
            answers: answerArray,
          }),
        })
        const json = (await response.json()) as { data?: ExamAnswerItem; error?: string }

        if (!response.ok || !json.data) {
          throw new Error(json.error || "Failed to submit your exam.")
        }

        setData((prev) => ({
          ...prev,
          answer: json.data!,
        }))

        toast({
          title: "Exam submitted (proctoring lost)",
          description: "Your exam was submitted because proctoring was interrupted.",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: getErrorMessage(error, "Failed to submit your exam."),
        })
      } finally {
        setIsSubmitting(false)
        setProctoringSubmissionInProgress(false)
      }
    })()
  }, [toast, proctoringSubmissionInProgress])

  // Keep the ref updated
  useEffect(() => {
    onProctoringLostRef.current = handleProctoringLost
  }, [handleProctoringLost])

  // Start the exam AFTER proctoring permissions have been granted
  const handleStartExam = useCallback(async () => {
    const success = await startProctoring()

    if (success) {
      setIsStartingExam(true)

      try {
        const res = await fetch("/api/student/exams/start", {
          method: "POST",
          credentials: "include",
        })
        const json = (await res.json()) as { data?: ExamData; error?: string }

        if (!res.ok || !json.data) {
          throw new Error(json.error || "Failed to start the exam.")
        }

        setData(json.data)

        toast({
          title: "Exam started",
          description: "Your exam has begun. Good luck!",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to start exam",
          description: getErrorMessage(error, "Could not start the exam. Please try again."),
        })
        stopProctoring()
      } finally {
        setIsStartingExam(false)
      }
    }
  }, [startProctoring, stopProctoring, toast])

  // Timer countdown with auto-submit
  useEffect(() => {
    if (!examActive || !data.answer?.startedAt) return

    const startTime = new Date(data.answer.startedAt).getTime()
    const durationMs = data.config.durationMinutes * 60 * 1000
    const endTime = startTime + durationMs

    // If time was already expired when page loaded, auto-submit with saved answers
    const initialRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000))
    if (initialRemaining <= 0) {
      setTimeLeft(0)
      // Parse saved answers from data.answer.answers directly (ref may not be initialized yet)
      let savedAnswers: Record<string, string> = {}
      try {
        const parsed = JSON.parse(data.answer.answers) as Array<{ questionId: string; answer: string }>
        for (const item of parsed) {
          savedAnswers[item.questionId] = item.answer
        }
      } catch {
        // Fall back to empty answers
      }
      void (async () => {
        if (isSubmittingRef.current) return
        setIsSubmitting(true)
        try {
          const answerArray = Object.entries(savedAnswers).map(([questionId, answer]) => ({
            questionId,
            answer,
          }))
          const response = await fetch("/api/student/exams/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              examAnswerId: data.answer!.id,
              answers: answerArray,
            }),
          })
          const json = (await response.json()) as { data?: ExamAnswerItem; error?: string }
          if (response.ok && json.data) {
            setData((prev) => ({ ...prev, answer: json.data! }))
            toast({
              title: "Time is up!",
              description: "Your exam was automatically submitted. Your answers have been saved.",
            })
          }
        } catch {
          // Auto-submit failed silently — answers are saved as draft
        } finally {
          setIsSubmitting(false)
        }
      })()
      return
    }

    const tick = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
      setTimeLeft(remaining)

      // 1 minute or less remaining → play beep and show alert (fires once)
      // Uses <= 60 instead of === 60 to handle timer throttling when tab is backgrounded
      if (remaining <= 60 && remaining > 0 && !oneMinuteAlertedRef.current) {
        oneMinuteAlertedRef.current = true
        playBeep()
        toast({
          title: "⏰ 1 minute remaining!",
          description: "Your exam will be automatically submitted when time runs out. Save any last changes now.",
        })
      }

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        // Auto-submit when time runs out — use refs for fresh data
        void (async () => {
          const currentData = dataRef.current
          const currentAnswers = answersRef.current
          const currentSubmitting = isSubmittingRef.current

          if (!currentData.answer || currentSubmitting) return

          setIsSubmitting(true)

          try {
            const answerArray = Object.entries(currentAnswers).map(([questionId, answer]) => ({
              questionId,
              answer,
            }))

            const response = await fetch("/api/student/exams/submit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                examAnswerId: currentData.answer.id,
                answers: answerArray,
              }),
            })
            const json = (await response.json()) as { data?: ExamAnswerItem; error?: string }

            if (!response.ok || !json.data) {
              throw new Error(json.error || "Failed to auto-submit your exam.")
            }

            setData((prev) => ({
              ...prev,
              answer: json.data!,
            }))

            toast({
              title: "Time is up!",
              description: "Your exam was automatically submitted. Your answers have been saved.",
            })
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Auto-submit failed",
              description: getErrorMessage(error, "Failed to submit your exam."),
            })
          } finally {
            setIsSubmitting(false)
          }
        })()
      }
    }

    // Reset the 1-minute alert flag on mount (in case effect re-runs)
    oneMinuteAlertedRef.current = false

    tick()
    timerRef.current = setInterval(tick, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [examActive, data.answer?.startedAt, data.config.durationMinutes, toast])

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async (isAutoSubmit = false) => {
    const currentData = dataRef.current
    const currentAnswers = answersRef.current

    if (!currentData.answer) return

    setIsSubmitting(true)

    try {
      const answerArray = Object.entries(currentAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }))

      const response = await fetch("/api/student/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          examAnswerId: currentData.answer.id,
          answers: answerArray,
        }),
      })
      const json = (await response.json()) as { data?: ExamAnswerItem; error?: string }

      if (!response.ok || !json.data) {
        throw new Error(json.error || "Failed to submit your exam.")
      }

      setData((prev) => ({
        ...prev,
        answer: json.data!,
      }))

      setShowSubmitDialog(false)

      toast({
        title: isAutoSubmit ? "Time is up!" : "Exam submitted",
        description: isAutoSubmit
          ? "Your exam was automatically submitted. Your answers have been saved."
          : "Your exam has been submitted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: getErrorMessage(error, "Failed to submit your exam."),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group questions by section
  const sections = data.questions.reduce(
    (acc, q) => {
      if (!acc[q.sectionTitle]) acc[q.sectionTitle] = []
      acc[q.sectionTitle].push(q)
      return acc
    },
    {} as Record<string, ExamQuestion[]>,
  )

  const answeredCount = Object.keys(answers).filter((qId) => (answers[qId] || "").trim().length > 0).length

  // ─── Render: Proctoring consent screen ────────────────────────────────────
  if (proctoringRequired && !proctoringState.isGranted && !proctoringState.error && !proctoringState.isStarting) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-indigo-100">
              <Camera className="size-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-indigo-900">Proctoring Required</h2>
            <p className="mt-2 text-sm text-indigo-700">
              This exam requires camera monitoring to ensure academic integrity.
            </p>

            <div className="mt-6 space-y-3 text-left">
              <div className="rounded-lg border border-indigo-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <Camera className="mt-0.5 size-5 text-indigo-500" />
                  <div>
                    <p className="font-medium text-indigo-900">Camera Monitoring</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Your camera will periodically capture snapshots (every 60s). This helps verify your identity and presence during the exam.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-medium text-amber-800">⚠️ Important</p>
                <p className="mt-0.5 text-xs text-amber-700">
                  If camera monitoring is interrupted at any point during the exam, your exam will be automatically submitted. Ensure you have a working camera and stable internet connection before starting.
                </p>
              </div>
            </div>

            <Button
              type="button"
              className="mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
              onClick={handleStartExam}
            >
              Start Exam with Proctoring
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">{data.config.title}</h3>
          <p className="text-sm text-slate-600">{data.config.description}</p>
          <p className="mt-2 text-sm text-slate-500">
            Course: {data.config.courseCode} &middot; {data.config.cohort} &middot; Total: {data.config.totalMarks} marks
          </p>
        </div>
      </div>
    )
  }

  // ─── Render: Proctoring error (permission denied or hardware issue) ───────
  if (proctoringRequired && proctoringState.error) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h2 className="text-2xl font-semibold text-red-900">Proctoring Unavailable</h2>
          <p className="mt-2 text-sm text-red-700">{proctoringState.error}</p>
          <p className="mt-1 text-sm text-red-600">
            This exam requires camera access. Please ensure you have granted the necessary permissions and try again.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={startProctoring}
            disabled={proctoringState.isStarting}
          >
            {proctoringState.isStarting ? <Spinner className="size-4" /> : null}
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // ─── Render: Exam starting (after proctoring granted, before exam API completes) ─
  if (proctoringRequired && isStartingExam) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 p-8 text-center">
        <Spinner className="size-8" />
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Starting Exam...</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your camera and screen are now active. Setting up your exam.
          </p>
        </div>
      </div>
    )
  }

  // ─── Render: Proctoring starting ──────────────────────────────────────────
  if (proctoringRequired && proctoringState.isStarting) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 p-8 text-center">
        <Spinner className="size-8" />
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Starting Proctoring...</h2>
          <p className="mt-1 text-sm text-slate-500">
            Please allow camera access when prompted by your browser. The exam will begin once permissions are granted.
          </p>
        </div>
      </div>
    )
  }

  // ─── Render: Proctoring lost (during active exam) ─────────────────────────
  if (proctoringRequired && proctoringState.isLost && examActive) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
          <Camera className="size-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-red-900">Proctoring Interrupted</h2>
          <p className="mt-1 text-sm text-red-700">
            Camera monitoring was stopped. Your exam is being submitted.
          </p>
          {isSubmitting && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-600">
              <Spinner className="size-4" />
              Submitting your exam...
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── Render: Exam ended by admin or no active exam ────────────────────────
  if (examEndedByAdmin || (data.config.status !== "active" && !examSubmitted && !data.answer?.isSubmitted)) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-2xl font-semibold text-amber-900">
            {examEndedByAdmin ? "Exam Ended" : "No Active Exam"}
          </h2>
          <p className="mt-2 text-sm text-amber-700">
            {examEndedByAdmin
              ? "The exam has been ended by the administrator. Your answers have been saved as a draft. You can resume when the exam is restarted."
              : "There is no active exam at the moment. Check back when the admin starts the exam."}
          </p>
          {data.answer && !data.answer.isSubmitted ? (
            <p className="mt-1 text-sm text-amber-600">
              Your draft answers are saved. They will be restored when the exam resumes.
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">{data.config.title}</h3>
          <p className="text-sm text-slate-600">{data.config.description}</p>
          <p className="mt-2 text-sm text-slate-500">
            Course: {data.config.courseCode} &middot; {data.config.cohort} &middot; Total: {data.config.totalMarks} marks
          </p>
        </div>
      </div>
    )
  }

  // ─── Render: Exam already submitted ────────────────────────────────────────
  if (examSubmitted) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h2 className="text-2xl font-semibold text-emerald-900">Exam Submitted</h2>
          <p className="mt-2 text-sm text-emerald-700">
            Your exam has been submitted successfully. You can no longer make changes.
          </p>
          {data.answer?.submittedAt ? (
            <p className="mt-1 text-sm text-emerald-700">
              Submitted: {new Date(data.answer.submittedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          ) : null}
          {data.answer?.score !== null && data.answer?.resultsNotified ? (
            <p className="mt-1 text-sm font-semibold text-emerald-900">
              Score: {data.answer?.score} / {data.config.totalMarks}
            </p>
          ) : data.answer?.score !== null && !data.answer?.resultsNotified ? (
            <p className="mt-1 text-sm italic text-slate-500">
              Your score is pending release by the admin.
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Your Answers</h3>
          <div className="mt-3 space-y-4">
            {data.questions.map((q) => {
              const answerText = answers[q.id] || ""
              return (
                <div key={q.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <div className="flex gap-3">
                    <span className="shrink-0 text-sm font-bold text-slate-400">Q{q.questionNumber}.</span>
                    <div>
                      <p className="text-sm text-slate-800">{q.questionText.substring(0, 200)}...</p>
                      <div className="mt-2 whitespace-pre-wrap rounded bg-white px-3 py-2 text-sm text-slate-700">
                        {answerText || <span className="italic text-slate-400">No answer provided</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ─── Render: Active exam with proctoring indicators ───────────────────────
  return (
    <div className="space-y-4">
      {/* Exam header bar */}
      <div className="sticky top-0 z-20 -mx-3 -mt-3 rounded-t-2xl border-b border-slate-200 bg-white px-3 pb-3 pt-3 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{data.config.title}</h2>
            <p className="text-xs text-slate-500">{data.config.description} &middot; {data.config.courseCode}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Proctoring status indicators */}
            {proctoringRequired && (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    proctoringState.isCameraActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span className={`inline-block size-1.5 rounded-full ${
                    proctoringState.isCameraActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                  }`} />
                  <Camera className="size-3" />
                  {proctoringState.isCameraActive ? "Camera" : "No Camera"}
                </span>

              </div>
            )}
            <div className="hidden text-right text-xs sm:block">
              {isSaving ? (
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-amber-500" />
                  Saving...
                </span>
              ) : lastSavedAt ? (
                <span className="text-slate-400">
                  Saved{" "}
                  {lastSavedAt.toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ) : null}
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-medium">{answeredCount}</span>/{data.questions.length} answered
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-indigo-900">Instructions</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-indigo-700">{data.config.instructions}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-indigo-600">
              <span>📝 {data.questions.length} questions</span>
              <span>🏆 {data.config.totalMarks} total marks</span>
              <span>⏱️ {data.config.durationMinutes} minutes</span>
              <span>📂 {Object.keys(sections).length} sections</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proctoring active banner */}
      {proctoringRequired && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center gap-2 text-xs text-emerald-700">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Recording Active
            </span>
            <span>Camera snapshots are being captured every 60 seconds for monitoring purposes.</span>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {Object.entries(sections).map(([sectionTitle, sectionQuestions]) => (
          <div key={sectionTitle} className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{sectionTitle}</h3>
            <div className="mt-3 space-y-4">
              {sectionQuestions.map((q) => (
                <div key={q.id} className="rounded-lg border border-slate-100 p-3">
                  <div className="flex gap-3">
                    <span className="shrink-0 text-sm font-bold text-slate-400">Q{q.questionNumber}.</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-slate-800">{q.questionText}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">[{q.marks} marks]</p>
                      <div className="mt-2">
                        <Textarea
                          rows={5}
                          value={answers[q.id] || ""}
                          onChange={(e) => updateAnswer(q.id, e.target.value)}
                          placeholder="Write your answer here with scriptural references..."
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 -mx-3 -mb-3 rounded-b-2xl border-t border-slate-200 bg-white px-3 pb-3 pt-3 sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-6 sm:pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            You have answered <strong>{answeredCount}</strong> of <strong>{data.questions.length}</strong> questions.
            {answeredCount < data.questions.length ? (
              <span className="ml-1 text-amber-600">Some questions are still unanswered.</span>
            ) : null}
          </p>
          <Button
            type="button"
            className="rounded-xl bg-slate-900"
            onClick={() => setShowSubmitDialog(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner className="size-4" /> : null}
            Submit Exam
          </Button>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Your Exam</DialogTitle>
            <DialogDescription>
              Please review carefully before submitting. Once submitted, you will not be able to make any changes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-semibold">⚠️ Important</p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>You have answered {answeredCount} out of {data.questions.length} questions.</li>
                <li>Once submitted, your answers are <strong>final</strong>.</li>
                <li>Ensure you have provided scriptural references where requested.</li>
                <li>Review your answers for completeness before final submission.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-semibold">📋 Submission Summary</p>
              <ul className="mt-1 space-y-1">
                <li>Course: {data.config.courseCode} &middot; {data.config.cohort}</li>
                <li>Total Questions: {data.questions.length}</li>
                <li>Total Marks: {data.config.totalMarks}</li>
              </ul>
            </div>

            {answeredCount < data.questions.length ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                ⚠️ You have {data.questions.length - answeredCount} unanswered question(s). Consider reviewing before submission.
              </div>
            ) : null}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setShowSubmitDialog(false)} disabled={isSubmitting}>
              Continue Writing
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-slate-900"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner className="size-4" /> : null}
              Yes, Submit My Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
