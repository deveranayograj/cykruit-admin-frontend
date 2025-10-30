"use client"

import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  fullWidth?: boolean
}

export function Button({
  className,
  fullWidth,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer",
        "hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
