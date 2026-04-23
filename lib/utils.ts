import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeExternalUrl(url: string | null | undefined) {
  if (!url) {
    return null
  }

  const trimmedUrl = url.trim()

  if (!trimmedUrl) {
    return null
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl
  }

  return `https://${trimmedUrl}`
}
