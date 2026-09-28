"use client"

import { motion, useReducedMotion } from "motion/react"
import { presets } from "@/lib/motion/presets"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface MotionButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  arrow?: boolean
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  type?: "button" | "submit" | "reset"
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      arrow = false,
      fullWidth = false,
      loading = false,
      disabled,
      onClick,
      className,
      type = "button",
    },
    ref
  ) => {
    const reduce = useReducedMotion()

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variantStyles = {
      primary:
        "bg-uisb-purple text-white hover:bg-uisb-purple/90 focus-visible:ring-uisb-purple shadow-lg shadow-uisb-purple/25",
      secondary:
        "bg-uisb-purple-pudar text-white hover:bg-uisb-purple-pudar/90 focus-visible:ring-uisb-purple-pudar",
      outline:
        "border-2 border-uisb-purple text-uisb-purple hover:bg-uisb-purple/10 focus-visible:ring-uisb-purple",
      ghost: "text-uisb-purple hover:bg-uisb-purple/10 focus-visible:ring-uisb-purple",
    }

    const sizeStyles = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-5 text-base",
      lg: "h-12 px-8 text-lg",
    }

    const isInteractive = !disabled && !loading

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        whileHover={reduce || !isInteractive ? undefined : presets.cta.whileHover}
        whileTap={reduce || !isInteractive ? undefined : presets.cta.whileTap}
        transition={reduce ? { duration: 0.01 } : presets.cta.transition}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
      >
        {loading && (
          <motion.svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
        )}
        {icon && iconPosition === "left" && !loading && (
          <span className="mr-2 flex-shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {(arrow || (icon && iconPosition === "right")) && !loading && (
          <motion.span
            className="ml-2 flex-shrink-0"
            whileHover={reduce ? undefined : presets.arrow.whileHover}
            transition={reduce ? { duration: 0.01 } : presets.arrow.transition}
          >
            {icon && iconPosition === "right" ? icon : "→"}
          </motion.span>
        )}
      </motion.button>
    )
  }
)

MotionButton.displayName = "MotionButton"