"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import * as Label from "@radix-ui/react-label"
import type { ComponentProps } from "react"

interface InputFieldsProps extends ComponentProps<"input"> {
  label?: string
  description?: string
  error?: string
  textarea?: boolean
  autocomplete?: string;
}

export const InputFields = ({
  label,
  description,
  error,
  textarea,
  type = "text",
  className,
  autocomplete,
  ...props
}: InputFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === "password" && showPassword ? "text" : type

  const sharedClasses = cn(
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    error && "border-destructive focus-visible:ring-destructive",
    className
  )

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label.Root className="text-sm font-medium text-foreground">
          {label}
        </Label.Root>
      )}

      <div className="relative">
        {textarea ? (
          <textarea
            className={cn(sharedClasses, "min-h-[80px] resize-y")}
            {...(props as ComponentProps<"textarea">)}
          />
        ) : (
          <>
            <input
              type={inputType}
              className={sharedClasses}
              autoComplete={autocomplete}
              {...props}
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </>
        )}
      </div>

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
