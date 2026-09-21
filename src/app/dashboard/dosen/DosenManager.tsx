"use client"

import { useRef, useState, useTransition } from "react"
import { Banner } from "@/components/ui/dashboard/banner"
import { Avatar, DataTable } from "@/components/ui/dashboard/data-table"
import { PageHeader, PrimaryButton, DangerButton, GhostButton } from "@/components/ui/dashboard/buttons"
import { Card } from "@/components/ui/dashboard/data-table"
import { Field, FileInput, TextArea, TextInput } from "@/components/ui/dashboard/form"
import {
  createDosenAction,
  deleteDosenAction,
  updateDosenAction,
} from "@/app/dashboard/dosen/actions"
import type { DosenItem, ProgramItem } from "@/lib/data-store"

type FormState = { mode: "create" } | { mode: "edit"; item: DosenItem }

export default function DosenManager({
  initial,
  programs,
}: {
  initial: DosenItem[]
  programs: ProgramItem[]
}) {
  const [form, setForm] = useState<FormState | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleCreate(fd: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await createDosenAction(fd)
      if (res.success) {
        setForm(null)
        setSuccess("Lecturer created")
      } else {
        setError(res.error ?? "Failed to create lecturer")
      }
    })
  }

  function handleUpdate(id: number, existingImage: string, fd: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await updateDosenAction(id, existingImage, fd)
      if (res.success) {
        setForm(null)
        setSuccess("Lecturer updated")
      } else {
        setError(res.error ?? "Failed to update lecturer")
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this lecturer?")) return
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await deleteDosenAction(id)
      if (res.success) {
        setSuccess("Lecturer deleted")
      } else {
        setError(res.error ?? "Failed to delete lecturer")
      }
    })
  }

  return (
    <div>
      <PageHeader
        title="Lecturers"
        description="Faculty members shown in the lecturers accordion on the homepage."
        actions={
          form == null ? (
            <PrimaryButton onClick={() => setForm({ mode: "create" })}>
              <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> New lecturer
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
        <DosenForm
          state={form}
          pending={pending}
          programs={programs}
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
        getKey={(d) => d.id}
        empty={
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-slate-500">No lecturers yet</p>
            <p className="text-[13px] text-slate-400">Click &ldquo;New lecturer&rdquo; to add the first one.</p>
          </div>
        }
        columns={[
          {
            key: "name",
            header: "Lecturer",
            render: (d) => (
              <div className="flex items-center gap-3">
                <Avatar src={d.image} alt={d.name} size={36} />
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{d.name}</div>
                  <div className="truncate text-[13px] text-slate-500">{d.campus || "—"}</div>
                </div>
              </div>
            ),
          },
          {
            key: "title",
            header: "Title",
            className: "w-56 text-slate-600",
            render: (d) => d.title,
          },
          {
            key: "id",
            header: "ID",
            className: "w-16 text-right font-mono text-[12px] text-slate-400",
            render: (d) => `#${String(d.id).padStart(3, "0")}`,
          },
          {
            key: "actions",
            header: "",
            className: "w-40 text-right",
            render: (d) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setSuccess(null)
                    setForm({ mode: "edit", item: d })
                  }}
                  className="rounded-md px-2.5 py-1 text-[14px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Edit
                </button>
                <DangerButton onClick={() => handleDelete(d.id)} disabled={pending}>
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

function DosenForm({
  state,
  pending,
  programs,
  onCancel,
  onCreate,
  onUpdate,
}: {
  state: FormState
  pending: boolean
  programs: ProgramItem[]
  onCancel: () => void
  onCreate: (fd: FormData) => void
  onUpdate: (id: number, existingImage: string, fd: FormData) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
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
            {isEdit ? "Edit lecturer" : "New lecturer"}
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
        <Field label="Full name" required htmlFor="dosen-name">
          <TextInput
            id="dosen-name"
            name="name"
            defaultValue={defaults?.name}
            placeholder="e.g. Dr. Rina Astuti, M.Kom"
            required
          />
        </Field>
        <Field
          label="Title / Position"
          required
          htmlFor="dosen-title"
          hint="Pilih dari daftar atau ketik manual"
        >
          <TextInput
            id="dosen-title"
            name="title"
            list="program-titles"
            defaultValue={defaults?.title}
            placeholder="Pilih atau ketik — e.g. Sistem Informasi"
            required
          />
          <datalist id="program-titles">
            {programs.map((p) => (
              <option key={p.id} value={p.title} />
            ))}
          </datalist>
          {programs.length === 0 && (
            <p className="mt-1 text-xs text-amber-600">Belum ada program — tambahkan di /dashboard/programs dulu.</p>
          )}
        </Field>
        <Field label="Campus" required htmlFor="dosen-campus">
          <TextInput
            id="dosen-campus"
            name="campus"
            defaultValue={defaults?.campus}
            placeholder="e.g. Universitas Indonesia Salemba"
            required
          />
        </Field>
        <Field label="Profile photo" required={!isEdit} htmlFor="dosen-image" className="sm:col-span-1">
          <div className="flex items-start gap-3">
            {preview && (
              <img
                src={preview}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
              />
            )}
            <FileInput
              id="dosen-image"
              name="imageFile"
              accept="image/*"
              required={!isEdit}
              ref={fileRef}
              onChange={handleFileChange}
            />
          </div>
        </Field>
        <Field label="Description" required htmlFor="dosen-description" className="sm:col-span-2">
          <TextArea
            id="dosen-description"
            name="description"
            defaultValue={defaults?.description}
            placeholder="Brief bio, research focus, and teaching areas."
            rows={4}
            required
          />
        </Field>
        <div className="flex items-center justify-end gap-2 sm:col-span-2">
          <GhostButton
            onClick={() => {
              if (fileRef.current) fileRef.current.value = ""
              setPreview(isEdit ? defaults?.image ?? null : null)
              onCancel()
            }}
            disabled={pending}
          >
            Cancel
          </GhostButton>
          <PrimaryButton type="submit" pending={pending}>
            {isEdit ? "Save changes" : "Create lecturer"}
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
