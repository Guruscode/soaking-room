"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getErrorMessage } from "@/lib/errors"
import type { LoginPayload, RegisterPayload } from "@/lib/types"
import type { SessionUser } from "@/lib/session"

type ApiResponse<T> = {
  data: T
  error?: string
}

type AuthContextValue = {
  user: SessionUser | null
  isAuthenticated: boolean
  isHydrating: boolean
  login: (payload: LoginPayload) => Promise<SessionUser>
  register: (payload: RegisterPayload) => Promise<SessionUser>
  logout: () => Promise<void>
  refreshSession: () => Promise<SessionUser | null>
  setUser: (user: SessionUser | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function parseResponse<T>(response: Response) {
  const data = (await response.json()) as ApiResponse<T>

  if (!response.ok) {
    throw new Error(data.error || "Request failed.")
  }

  return data.data
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: SessionUser | null
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser)
  const [isHydrating, setIsHydrating] = useState(!initialUser)
  const router = useRouter()

  const refreshSession = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })

      const sessionUser = await parseResponse<SessionUser | null>(response)
      setUser(sessionUser)
      return sessionUser
    } catch (error) {
      setUser(null)
      throw new Error(getErrorMessage(error))
    } finally {
      setIsHydrating(false)
    }
  }

  useEffect(() => {
    if (initialUser) {
      setIsHydrating(false)
      return
    }

    void refreshSession().catch(() => undefined)
  }, [initialUser])

  const login = async (payload: LoginPayload) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })

    const sessionUser = await parseResponse<SessionUser>(response)
    setUser(sessionUser)
    router.refresh()
    return sessionUser
  }

  const register = async (payload: RegisterPayload) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })

    const sessionUser = await parseResponse<SessionUser>(response)
    setUser(sessionUser)
    router.refresh()
    return sessionUser
  }

  const logout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })

    await parseResponse<null>(response)
    setUser(null)
    router.refresh()
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isHydrating,
      login,
      register,
      logout,
      refreshSession,
      setUser,
    }),
    [isHydrating, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.")
  }

  return context
}
