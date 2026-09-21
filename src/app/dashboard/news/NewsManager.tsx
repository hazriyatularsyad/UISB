"use client"

import { useRef, useState, useTransition } from "react"
import { Banner } from "@/components/ui/dashboard/banner"
import { DangerButton, GhostButton, PrimaryButton } from "@/components/ui/dashboard/buttons"
import { DataTable } from "@/components/ui/dashboard/data-table"
import { Field, FileInput, TextArea, TextInput } from "@/components/ui/dashboard/form"
import { PageHeader } from "@/components/ui/dashboard/buttons"
import { Card } from "@/components/ui/dashboard/data-table"
import {
  createNewsAction,
  deleteNewsAction,
  updateNewsAction,
} from "@/app/dashboard/news/actions"
import type { NewsItem } from "@/lib/data-store"

type FormState = { mode: "create" } | { mode: "edit"; item: NewsItem }

export default function NewsManager({ initial }: { initial: NewsItem[] }) {
  const [form, setForm] = useState<FormState | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleCreate(formData: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await createNewsAction(formData)
      if (res.success) {
        setForm(null)
        setSuccess("News item created")
      } else {
        setError(res.error ?? "Failed to create news item")
      }
    })
  }

  function handleUpdate(id: number, existingImage: string, formData: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await updateNewsAction(id, existingImage, formData)
      if (res.success) {
        setForm(null)
        setSuccess("News item updated")
      } else {
        setError(res.error ?? "Failed to update news item")
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this news item?")) return
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await deleteNewsAction(id)
      if (res.success) {
        setSuccess("News item deleted")
      } else {
        setError(res.error ?? "Failed to delete news item")
      }
    })
  }

  return (
    <div>
      <PageHeader
        title="News"
        description="Articles and announcements shown on the homepage."
        actions={
          form == null ? (
            <PrimaryButton onClick={() => setForm({ mode: "create" })}>
              <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> New news
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
        <NewsForm
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
        getKey={(n) => n.id}
        empty={
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-slate-500">No news items yet</p>
            <p className="text-[13px] text-slate-400">Click &ldquo;New news&rdquo; to create the first one.</p>
          </div>
        }
        columns={[
          {
            key: "title",
            header: "Article",
            render: (n) => (
              <div className="flex items-center gap-3">
                <img
                  src={n.image}
                  alt=""
                  className="h-10 w-16 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{n.title}</div>
                  <div className="truncate text-[13px] text-slate-500">{n.link || "#"}</div>
                </div>
              </div>
            ),
          },
          {
            key: "date",
            header: "Date",
            className: "w-32 text-slate-500 tabular-nums",
            render: (n) => n.date,
          },
          {
            key: "id",
            header: "ID",
            className: "w-16 text-right font-mono text-[12px] text-slate-400",
            render: (n) => `#${String(n.id).padStart(3, "0")}`,
          },
          {
            key: "actions",
            header: "",
            className: "w-40 text-right",
            render: (n) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setSuccess(null)
                    setForm({ mode: "edit", item: n })
                  }}
                  className="rounded-md px-2.5 py-1 text-[14px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Edit
                </button>
                <DangerButton
                  onClick={() => handleDelete(n.id)}
                  disabled={pending}
                >
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

function NewsForm({
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
  const [preview, setPreview] = useState<string | null>(defaults?.image ?? null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    if (isEdit) {
      onUpdate(state.item.id, defaults?.image ?? "", fd)
    } else {
      onCreate(fd)
    }
  }

  return (
    <Card className="mb-6">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
            {isEdit ? "Edit news" : "New news"}
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
        <Field label="Title" required htmlFor="news-title" className="sm:col-span-2">
          <TextInput
            id="news-title"
            name="title"
            defaultValue={defaults?.title}
            placeholder="e.g. Spring admissions open"
            required
          />
        </Field>
        <Field label="Date" required htmlFor="news-date">
          <TextInput
            id="news-date"
            name="date"
            type="date"
            defaultValue={defaults?.date}
            required
          />
        </Field>
        <Field label="Link" htmlFor="news-link" hint="Optional">
          <TextInput
            id="news-link"
            name="link"
            defaultValue={defaults?.link ?? "#"}
            placeholder="#"
          />
        </Field>
        <Field label="Description" required htmlFor="news-description" className="sm:col-span-2">
          <TextArea
            id="news-description"
            name="description"
            defaultValue={defaults?.description}
            placeholder="A short summary shown on the homepage card."
            rows={4}
            required
          />
        </Field>
        <Field
          label={isEdit ? "Replace image" : "Cover image"}
          required={!isEdit}
          htmlFor="news-image"
          className="sm:col-span-2"
        >
          <div className="flex items-start gap-4">
            {preview && (
              <img
                src={preview}
                alt=""
                className="h-20 w-32 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
              />
            )}
            <FileInput
              id="news-image"
              name="imageFile"
              accept="image/*"
              required={!isEdit && !defaults?.image}
              onChange={handleFileChange}
              className="flex-1"
            />
          </div>
        </Field>
        <div className="flex items-center justify-end gap-2 sm:col-span-2">
          <GhostButton onClick={onCancel} disabled={pending}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit" pending={pending}>
            {isEdit ? "Save changes" : "Create news"}
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
