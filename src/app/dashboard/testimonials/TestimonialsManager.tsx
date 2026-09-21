"use client"

import { useRef, useState, useTransition } from "react"
import { Banner } from "@/components/ui/dashboard/banner"
import { Avatar, DataTable } from "@/components/ui/dashboard/data-table"
import { PageHeader, PrimaryButton, DangerButton, GhostButton } from "@/components/ui/dashboard/buttons"
import { Card } from "@/components/ui/dashboard/data-table"
import { Field, FileInput, TextArea, TextInput } from "@/components/ui/dashboard/form"
import {
  createTestimonialAction,
  deleteTestimonialAction,
  updateTestimonialAction,
} from "@/app/dashboard/testimonials/actions"
import type { TestimonialItem } from "@/lib/data-store"

type FormState = { mode: "create" } | { mode: "edit"; item: TestimonialItem }

export default function TestimonialsManager({ initial }: { initial: TestimonialItem[] }) {
  const [form, setForm] = useState<FormState | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleCreate(formData: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await createTestimonialAction(formData)
      if (res.success) {
        setForm(null)
        setSuccess("Testimonial created")
      } else {
        setError(res.error ?? "Failed to create testimonial")
      }
    })
  }

  function handleUpdate(id: number, existingImage: string, formData: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await updateTestimonialAction(id, existingImage, formData)
      if (res.success) {
        setForm(null)
        setSuccess("Testimonial updated")
      } else {
        setError(res.error ?? "Failed to update testimonial")
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this testimonial?")) return
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await deleteTestimonialAction(id)
      if (res.success) {
        setSuccess("Testimonial deleted")
      } else {
        setError(res.error ?? "Failed to delete testimonial")
      }
    })
  }

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Quotes and ratings from students and alumni shown on the homepage."
        actions={
          form == null ? (
            <PrimaryButton onClick={() => setForm({ mode: "create" })}>
              <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> New testimonial
            </PrimaryButton>
          ) : null
        }
      />

      {success && (
        <Banner tone="success" onDismiss={() => setSuccess(null)}>
          {success}
        </Banner>
      )}
      {error && (
        <Banner tone="error" onDismiss={() => setError(null)}>
          {error}
        </Banner>
      )}

      {form && (
        <TestimonialForm
          state={form}
          pending={pending}
          onCancel={() => {
            setForm(null)
            setError(null)
          }}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}

      <DataTable
        rows={initial}
        getKey={(t) => t.id}
        empty={
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-slate-500">No testimonials yet</p>
            <p className="text-[13px] text-slate-400">Click &ldquo;New testimonial&rdquo; to add the first one.</p>
          </div>
        }
        columns={[
          {
            key: "name",
            header: "Person",
            render: (t) => (
              <div className="flex items-center gap-3">
                <Avatar src={t.profile_image} alt={t.name} size={36} />
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{t.name}</div>
                  <div className="truncate text-[13px] text-slate-500">{t.designation}</div>
                </div>
              </div>
            ),
          },
          {
            key: "excerpt",
            header: "Quote",
            className: "text-slate-500 max-w-md",
            render: (t) => (
              <p className="line-clamp-2 text-[14px] leading-6 text-slate-500">{t.description}</p>
            ),
          },
          {
            key: "id",
            header: "ID",
            className: "w-16 text-right font-mono text-[12px] text-slate-400",
            render: (t) => `#${String(t.id).padStart(3, "0")}`,
          },
          {
            key: "actions",
            header: "",
            className: "w-40 text-right",
            render: (t) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setSuccess(null)
                    setForm({ mode: "edit", item: t })
                  }}
                  className="rounded-md px-2.5 py-1 text-[14px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Edit
                </button>
                <DangerButton onClick={() => handleDelete(t.id)} disabled={pending}>
                  Delete
                </DangerButton>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

function TestimonialForm({
  state,
  pending,
  onCancel,
  onCreate,
  onUpdate,
}: {
  state: FormState
  pending: boolean
  onCancel: () => void
  onCreate: (fd: FormData) => void
  onUpdate: (id: number, existingImage: string, fd: FormData) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const isEdit = state.mode === "edit"
  const defaults = isEdit ? state.item : null
  const [preview, setPreview] = useState<string | null>(defaults?.profile_image ?? null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    if (isEdit) {
      onUpdate(state.item.id, defaults?.profile_image ?? "", fd)
    } else {
      onCreate(fd)
    }
  }

  return (
    <Card className="mb-6">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
            {isEdit ? "Edit testimonial" : "New testimonial"}
          </h2>
          <span className="text-[13px] text-slate-400">
            {isEdit ? `Editing #${String(state.item.id).padStart(3, "0")}` : "Draft"}
          </span>
        </div>
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-5 px-6 py-6 sm:grid-cols-2"
      >
        <Field label="Name" required htmlFor="testimonial-name">
          <TextInput
            id="testimonial-name"
            name="name"
            defaultValue={defaults?.name}
            placeholder="e.g. Andi Pratama"
            required
          />
        </Field>
        <Field label="Designation" required htmlFor="testimonial-designation">
          <TextInput
            id="testimonial-designation"
            name="designation"
            defaultValue={defaults?.designation}
            placeholder="e.g. Information Systems, Class of 2023"
            required
          />
        </Field>
        <Field label="Profile photo" required={!isEdit} htmlFor="testimonial-image">
          <div className="flex items-start gap-3">
            {preview && (
              <img
                src={preview}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
              />
            )}
            <FileInput
              id="testimonial-image"
              name="profileImageFile"
              accept="image/*"
              required={!isEdit && !defaults?.profile_image}
              onChange={handleFileChange}
            />
          </div>
        </Field>
        <Field label="Quote" required htmlFor="testimonial-description" className="sm:col-span-2">
          <TextArea
            id="testimonial-description"
            name="description"
            defaultValue={defaults?.description}
            placeholder="The full quote shown on the homepage."
            rows={5}
            required
          />
        </Field>
        <div className="flex items-center justify-end gap-2 sm:col-span-2">
          <GhostButton onClick={onCancel} disabled={pending}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit" pending={pending}>
            {isEdit ? "Save changes" : "Create testimonial"}
          </PrimaryButton>
        </div>
      </form>
    </Card>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
