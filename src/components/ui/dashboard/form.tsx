import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react"

const baseInput =
  "block w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] leading-6 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  className = "",
  children,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  htmlFor?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={"block " + className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 flex items-center justify-between text-[14px] font-medium leading-5 text-slate-700"
      >
        <span>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
        {hint && <span className="text-slate-400 font-normal">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[13px] text-red-600">{error}</p>}
    </div>
  )
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className = "", ...props }, ref) {
    return <input ref={ref} className={baseInput + " " + className} {...props} />
  }
)

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea({ className = "", ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={baseInput + " min-h-[100px] resize-y " + className}
        {...props}
      />
    )
  }
)

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", ...props }, ref) {
    return <select ref={ref} className={baseInput + " " + className} {...props} />
  }
)

export const FileInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function FileInput({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        type="file"
        className={
          "block w-full cursor-pointer rounded-md border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[14px] text-slate-600 file:mr-3 file:rounded file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-white hover:border-slate-400 focus:border-slate-900 focus:outline-none " +
          className
        }
        {...props}
      />
    )
  }
)
