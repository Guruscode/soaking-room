"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export type ProctoringState = {
  /** Whether proctoring has been granted (camera) */
  isGranted: boolean
  /** Whether camera is currently active */
  isCameraActive: boolean
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
  const [state, setState] = useState<ProctoringState>({
    isGranted: false,
    isCameraActive: false,
    isLost: false,
    isStarting: false,
    error: null,
    needsConsent: true,
  })

  const cameraStreamRef = useRef<MediaStream | null>(null)
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null)
  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
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

  // Start proctoring (camera only). Returns true if successful, false if failed.
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

      setState((prev) => ({
        ...prev,
        isGranted: true,
        isCameraActive: true,
        isStarting: false,
        needsConsent: false,
        isLost: false,
      }))

      lostNotifiedRef.current = false

      // Start periodic snapshot capture
      captureSnapshot() // Initial capture immediately
      const captureInterval = setInterval(captureSnapshot, CAPTURE_INTERVAL_MS)
      captureIntervalRef.current = captureInterval

      // Log successful start
      await fetch("/api/student/exams/proctoring-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventType: "proctoring_started", eventData: "Camera monitoring activated" }),
      })

      return true
    } catch (error) {
      // Clean up any partially acquired streams
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop())
        cameraStreamRef.current = null
      }
      if (cameraVideoRef.current) {
        cameraVideoRef.current.remove()
        cameraVideoRef.current = null
      }

      let errorMessage = "Could not start proctoring."

      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          errorMessage = "Camera permission was denied. Please allow camera access to take the exam."
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
      }))

      return false
    }
  }, [captureSnapshot])

  // Stop proctoring — clean up all streams
  const stopProctoring = useCallback(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current)
      captureIntervalRef.current = null
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop())
      cameraStreamRef.current = null
    }

    if (cameraVideoRef.current) {
      cameraVideoRef.current.remove()
      cameraVideoRef.current = null
    }

    setState({
      isGranted: false,
      isCameraActive: false,
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

      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop())
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
