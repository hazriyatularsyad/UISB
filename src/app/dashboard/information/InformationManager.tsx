"use client"

import { useRef, useState, useTransition } from "react"
import { Banner } from "@/components/ui/dashboard/banner"
import { DangerButton, GhostButton, PageHeader, PrimaryButton } from "@/components/ui/dashboard/buttons"
import { DataTable, Card } from "@/components/ui/dashboard/data-table"
import { Field, FileInput, TextArea, TextInput } from "@/components/ui/dashboard/form"
import {
  createInformationAction,
  deleteInformationAction,
  updateInformationAction,
} from "@/app/dashboard/information/actions"
import type { InformationItem } from "@/lib/data-store"

type FormState = { mode: "create" } | { mode: "edit"; item: InformationItem }

export default function InformationManager({ initial }: { initial: InformationItem[] }) {
  const [form, setForm] = useState<FormState | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleCreate(fd: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await createInformationAction(fd)
      if (res.success) {
        setForm(null)
        setSuccess("Information created")
      } else setError(res.error ?? "Failed to create information")
    })
  }

  function handleUpdate(id: number, existingImage: string, fd: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await updateInformationAction(id, existingImage, fd)
      if (res.success) {
        setForm(null)
        setSuccess("Information updated")
      } else setError(res.error ?? "Failed to update information")
    })
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this information?")) return
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await deleteInformationAction(id)
      if (res.success) setSuccess("Information deleted")
      else setError(res.error ?? "Failed to delete information")
    })
  }

  return (
    <div>
      <PageHeader
        title="Information"
        description="Informasi — tampil di halaman /information"
        actions={
          form == null ? (
            <PrimaryButton onClick={() => setForm({ mode: "create" })}>
              <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> New information
            </PrimaryButton>
          ) : null
        }
      />

      {success && <Banner tone="success" onDismiss={() => setSuccess(null)}>{success}</Banner>}
      {error && <Banner tone="error" onDismiss={() => setError(null)}>{error}</Banner>}

      {form && (
        <InformationForm
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
        getKey={(s) => s.id}
        empty={
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-slate-500">No information yet</p>
            <p className="text-[13px] text-slate-400">
              Click &ldquo;New information&rdquo; to create the first one.
            </p>
          </div>
        }
        columns={[
          {
            key: "title",
            header: "Information",
            render: (s) => (
              <div className="flex items-center gap-3">
                <img
                  src={s.image}
                  alt=""
                  className="h-10 w-16 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-slate-900">
                    {s.title}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    /{s.slug}
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: "is_active",
            header: "Active",
            className: "w-20 text-center",
            render: (s) => (
              <span
                className={
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-medium " +
                  (s.is_active
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-slate-100 text-slate-500 ring-1 ring-slate-200")
                }
              >
                {s.is_active ? "Yes" : "No"}
              </span>
            ),
          },
          {
            key: "id",
            header: "ID",
            className: "w-16 text-right font-mono text-xs text-slate-400",
            render: (s) => `#${String(s.id).padStart(3, "0")}`,
          },
          {
            key: "actions",
            header: "",
            className: "w-32 text-right",
            render: (s) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setSuccess(null)
                    setForm({ mode: "edit", item: s })
                  }}
                  className="rounded-md px-2.5 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  Edit
                </button>
                <DangerButton
                  onClick={() => handleDelete(s.id)}
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

function InformationForm({
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
    const f = e.target.files?.[0]
    if (f) setPreview(URL.createObjectURL(f))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    if (isEdit) onUpdate(state.item.id, defaults?.image ?? "", fd)
    else onCreate(fd)
  }

  return (
    <Card className="mb-6">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
            {isEdit ? "Edit information" : "New information"}
          </h2>
          <span className="text-[13px] text-slate-400">
            {isEdit
              ? `Editing #${String(state.item.id).padStart(3, "0")}`
              : "Draft"}
          </span>
        </div>
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-5 px-6 py-6 sm:grid-cols-2"
      >
        <Field label="Title" required htmlFor="info-title">
          <TextInput
            id="info-title"
            name="title"
            defaultValue={defaults?.title}
            required
          />
        </Field>
        <Field label="Active" htmlFor="info-active" className="flex items-center">
          <label htmlFor="info-active" className="flex items-center gap-2 text-sm text-slate-700">
            <input
              id="info-active"
              type="checkbox"
              name="is_active"
              defaultChecked={defaults?.is_active ?? true}
              className="h-4 w-4 rounded border-slate-300"
            />
            Active
          </label>
        </Field>
        <Field label="Description" htmlFor="info-desc" className="sm:col-span-2">
          <TextArea
            id="info-desc"
            name="description"
            defaultValue={defaults?.description}
            placeholder="Deskripsi informasi..."
            rows={4}
          />
        </Field>
        <Field
          label={isEdit ? "Replace image" : "Cover image"}
          required={!isEdit}
          htmlFor="info-image"
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
              id="info-image"
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
            {isEdit ? "Save changes" : "Create information"}
          </PrimaryButton>
        </div>
      </form>
    </Card>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}