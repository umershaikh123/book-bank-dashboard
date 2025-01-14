import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function calculateTimeDifference(createdAt: string): string {
  const now = new Date()
  const then = new Date(createdAt)
  const diffMs = Math.abs(now.getTime() - then.getTime())

  const diffMins = Math.round(diffMs / (1000 * 60))
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins === 0) {
    return "Just now"
  } else if (diffMins < 60) {
    return `${diffMins} min ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else if (diffDays < 365) {
    return `${Math.round(diffDays / 30)} month${Math.round(diffDays / 30) > 1 ? "s" : ""} ago`
  } else {
    return `${Math.round(diffDays / 365)} year${Math.round(diffDays / 365) > 1 ? "s" : ""} ago`
  }
}
