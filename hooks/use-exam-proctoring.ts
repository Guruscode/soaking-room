"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export type ProctoringState = {
  /** Whether proctoring has been granted (camera + screen) */
  isGranted: boolean
  /** Whether camera is currently active */
  isCameraActive: boolean
  /** Whether screen share is currently active */
  isScreenActive: boolean
  /** Whether proctoring has been lost (stream interrupted) */
  isLost: boolean
  /** Whether proctoring is currently starting */
  isStarting: boolean
  /** Error message if permission was denied */
  error: string | null
  /** Whether the consent screen should be shown */
  needsConsent: boolean
}

const CAPTURE_INTERVAL_MS = 60_000 // 60 seconds

export function useExamProctoring({
  isExamActive,
  onProctoringLost,
}: {
  isExamActive: boolean
  onProctoringLost: () => void
}) {
  const { toast } = useToast()
  const [state, setState] = useState<ProctoringState>({
    isGranted: false,
    isCameraActive: false,
    isScreenActive: false,
    isLost: false,
    isStarting: false,
    error: null,
    needsConsent: true,
  })

  const cameraStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const screenChunkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lostNotifiedRef = useRef(false)
  const stateRef = useRef(state)
  const onProctoringLostRef = useRef(onProctoringLost)

  // Keep refs in sync
  useEffect(() => { stateRef.current = state }, [state])
  useEffect(() => { onProctoringLostRef.current = onProctoringLost }, [onProctoringLost])

  // Capture a camera snapshot
  const captureSnapshot = useCallback(() => {
    const video = cameraVideoRef.current
    if (!video || !video.videoWidth) return

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.5)

    // Send to server (use keepalive for reliability)
    fetch("/api/student/exams/camera-snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      keepalive: true,
      body: JSON.stringify({ imageBase64 }),
    }).catch(() => {
      // Silently fail — snapshot is best-effort
    })
  }, [])

  // Handle visibility changes (log when student leaves the tab)
  useEffect(() => {
    if (!state.isGranted || !isExamActive) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Capture a snapshot before the tab goes to background
        captureSnapshot()

        // Log the event
        fetch("/api/student/exams/proctoring-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          keepalive: true,
          body: JSON.stringify({ eventType: "visibility_hidden", eventData: "Tab went to background" }),
        }).catch(() => {})
      } else if (document.visibilityState === "visible") {
        fetch("/api/student/exams/proctoring-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          keepalive: true,
          body: JSON.stringify({ eventType: "visibility_visible", eventData: "Tab returned to foreground" }),
        }).catch(() => {})
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [state.isGranted, isExamActive, captureSnapshot])

  // Monitor camera stream for interruptions
  useEffect(() => {
    if (!state.isCameraActive || !isExamActive) return

    const checkCamera = setInterval(() => {
      const stream = cameraStreamRef.current
      if (!stream) {
        if (!lostNotifiedRef.current) {
          lostNotifiedRef.current = true
          setState((prev) => ({ ...prev, isLost: true, isCameraActive: false }))

          fetch("/api/student/exams/proctoring-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ eventType: "camera_stopped", eventData: "Camera stream was interrupted" }),
          }).catch(() => {})

          onProctoringLostRef.current()
        }
        return
      }

      const tracks = stream.getVideoTracks()
      if (tracks.length === 0 || !tracks[0].enabled || tracks[0].readyState === "ended") {
        if (!lostNotifiedRef.current) {
          lostNotifiedRef.current = true
          setState((prev) => ({ ...prev, isLost: true, isCameraActive: false }))

          fetch("/api/student/exams/proctoring-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ eventType: "camera_stopped", eventData: "Camera track ended" }),
          }).catch(() => {})

          onProctoringLostRef.current()
        }
      }
    }, 5000)

    return () => clearInterval(checkCamera)
  }, [state.isCameraActive, isExamActive])

  // Monitor screen stream for interruptions
  useEffect(() => {
    if (!state.isScreenActive || !isExamActive) return

    const checkScreen = setInterval(() => {
      const stream = screenStreamRef.current
      if (!stream) {
        if (!lostNotifiedRef.current) {
          lostNotifiedRef.current = true
          setState((prev) => ({ ...prev, isLost: true, isScreenActive: false }))

          fetch("/api/student/exams/proctoring-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ eventType: "screen_share_stopped", eventData: "Screen share stream was interrupted" }),
          }).catch(() => {})

          onProctoringLostRef.current()
        }
        return
      }

      const tracks = stream.getVideoTracks()
      if (tracks.length === 0 || !tracks[0].enabled || tracks[0].readyState === "ended") {
        if (!lostNotifiedRef.current) {
          lostNotifiedRef.current = true
          setState((prev) => ({ ...prev, isLost: true, isScreenActive: false }))

          fetch("/api/student/exams/proctoring-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ eventType: "screen_share_stopped", eventData: "Screen share track ended" }),
          }).catch(() => {})

          onProctoringLostRef.current()
        }
      }
    }, 5000)

    return () => clearInterval(checkScreen)
  }, [state.isScreenActive, isExamActive])

  // Record screen in chunks
  const startScreenRecording = useCallback(() => {
    const stream = screenStreamRef.current
    if (!stream) return

    let recordingChunks: Blob[] = []
    let chunkStartTime = Date.now()

    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
          ? "video/webm;codecs=vp8"
          : "video/webm",
    })

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordingChunks.push(event.data)
      }
    }

    recorder.onstop = () => {
      // Upload any remaining chunk
      if (recordingChunks.length > 0) {
        const blob = new Blob(recordingChunks, { type: "video/webm" })
        const durationSeconds = (Date.now() - chunkStartTime) / 1000

        const formData = new FormData()
        formData.append("chunk", blob, `screen_${chunkStartTime}.webm`)
        formData.append("durationSeconds", String(durationSeconds))

        navigator.sendBeacon("/api/student/exams/screen-recording", formData)
        recordingChunks = []
      }
    }

    // Record in 60-second chunks
    mediaRecorderRef.current = recorder
    chunkStartTime = Date.now()
    recorder.start()

    if (screenChunkIntervalRef.current) {
      clearInterval(screenChunkIntervalRef.current)
    }

    screenChunkIntervalRef.current = setInterval(() => {
      if (recorder.state === "recording") {
        const currentDuration = (Date.now() - chunkStartTime) / 1000
        recorder.requestData() // Get current data without stopping

        // Every 60 seconds, stop and restart to create a new chunk
        if (currentDuration >= 60) {
          recorder.stop()

          // Upload the completed chunk
          if (recordingChunks.length > 0) {
            const blob = new Blob(recordingChunks, { type: "video/webm" })

            const formData = new FormData()
            formData.append("chunk", blob, `screen_${chunkStartTime}.webm`)
            formData.append("durationSeconds", String(currentDuration))

            fetch("/api/student/exams/screen-recording", {
              method: "POST",
              credentials: "include",
              body: formData,
            }).catch(() => {})

            recordingChunks = []
          }

          chunkStartTime = Date.now()
          recorder.start()
        }
      }
    }, 10_000) // Check every 10 seconds
  }, [])

  // Start proctoring (camera + screen share). Returns true if successful, false if failed.
  const startProctoring = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isStarting: true, error: null }))

    try {
      // Request camera
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 5 } },
        audio: false,
      })

      cameraStreamRef.current = cameraStream

      // Attach to a hidden video element for frame capture
      const video = document.createElement("video")
      video.srcObject = cameraStream
      video.playsInline = true
      video.muted = true
      video.autoplay = true
      video.style.display = "none"
      document.body.appendChild(video)
      cameraVideoRef.current = video

      await video.play()

      // Request screen share
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })

      screenStreamRef.current = screenStream

      // Handle screen share stop from browser UI
      screenStream.getVideoTracks()[0].onended = () => {
        if (!lostNotifiedRef.current) {
          lostNotifiedRef.current = true
          setState((prev) => ({ ...prev, isLost: true, isScreenActive: false }))

          fetch("/api/student/exams/proctoring-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ eventType: "screen_share_stopped", eventData: "User stopped screen share via browser UI" }),
          }).catch(() => {})

          onProctoringLostRef.current()
        }
      }

      setState((prev) => ({
        ...prev,
        isGranted: true,
        isCameraActive: true,
        isScreenActive: true,
        isStarting: false,
        needsConsent: false,
        isLost: false,
      }))

      lostNotifiedRef.current = false

      // Start periodic snapshot capture
      captureSnapshot() // Initial capture immediately
      const captureInterval = setInterval(captureSnapshot, CAPTURE_INTERVAL_MS)
      captureIntervalRef.current = captureInterval

      // Start screen recording
      startScreenRecording()

      // Log successful start
      await fetch("/api/student/exams/proctoring-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventType: "proctoring_started", eventData: "Camera and screen share activated" }),
      })

      return true
    } catch (error) {
      // Clean up any partially acquired streams
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop())
        cameraStreamRef.current = null
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop())
        screenStreamRef.current = null
      }
      if (cameraVideoRef.current) {
        cameraVideoRef.current.remove()
        cameraVideoRef.current = null
      }

      let errorMessage = "Could not start proctoring."

      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          errorMessage = "Camera or screen share permission was denied. Please allow both to take the exam."
        } else if (error.name === "NotFoundError") {
          errorMessage = "No camera found on this device."
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setState((prev) => ({
        ...prev,
        isGranted: false,
        isStarting: false,
        error: errorMessage,
        isCameraActive: false,
        isScreenActive: false,
      }))

      return false
    }
  }, [captureSnapshot, startScreenRecording])

  // Stop proctoring — clean up all streams
  const stopProctoring = useCallback(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current)
      captureIntervalRef.current = null
    }

    if (screenChunkIntervalRef.current) {
      clearInterval(screenChunkIntervalRef.current)
      screenChunkIntervalRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop())
      cameraStreamRef.current = null
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop())
      screenStreamRef.current = null
    }

    if (cameraVideoRef.current) {
      cameraVideoRef.current.remove()
      cameraVideoRef.current = null
    }

    setState({
      isGranted: false,
      isCameraActive: false,
      isScreenActive: false,
      isLost: false,
      isStarting: false,
      error: null,
      needsConsent: true,
    })
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current)
      }

      if (screenChunkIntervalRef.current) {
        clearInterval(screenChunkIntervalRef.current)
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }

      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop())
      }

      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop())
      }

      if (cameraVideoRef.current) {
        cameraVideoRef.current.remove()
      }
    }
  }, [])

  return {
    state,
    startProctoring,
    stopProctoring,
  }
}
