"use client"

import React from "react"
import clsx from "clsx"

type StatusBadgeProps = {
  status: string | null | undefined
}

const STATUS_STYLES: Record<string, string> = {
  // General statuses
  active: "bg-green-600 text-white",
  inactive: "bg-gray-500 text-white",

  // Entry statuses
  entered: "bg-blue-600 text-white",
  exited: "bg-gray-700 text-white",

  // Approval statuses
  approved: "bg-green-700 text-white",
  unapproved: "bg-red-600 text-white",
  pending: "bg-yellow-500 text-black",
  cancelled: "bg-orange-600 text-white",
  blacklist: "bg-red-600 text-white",

  // Validation statuses
  valid: "bg-green-500 text-white",
  invalid: "bg-red-500 text-white",

  // Issue statuses
  issued: "bg-indigo-600 text-white",
  unissued: "bg-purple-500 text-white",

  // visitor_mode
  walkin: "bg-yellow-600 text-white",
  appointment: "bg-green-600 text-white",
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status?.toLowerCase() ?? ""

  const style = STATUS_STYLES[normalized] ?? "bg-gray-400 text-white"
  const displayStatus = status && STATUS_STYLES[normalized] ? status : "_"

  return (
    <span
      className={clsx(
        "px-3 py-[5px] rounded-sm text-sm font-semibold capitalize",
        style
      )}
    >
      {displayStatus}
    </span>
  )
}
