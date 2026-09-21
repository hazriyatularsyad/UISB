"use client"

import { useRef, useState, useTransition } from "react"
import { Banner } from "@/components/ui/dashboard/banner"
import { DangerButton, GhostButton, PrimaryButton } from "@/components/ui/dashboard/buttons"
import { DataTable } from "@/components/ui/dashboard/data-table"
import { Field, FileInput, TextArea, TextInput } from "@/components/ui/dashboard/form"
import { PageHeader } from "@/components/ui/dashboard/buttons"
import { Card } from "@/components/ui/dashboard/data-table"
import { createFacilityAction, deleteFacilityAction, updateFacilityAction } from "@/app/dashboard/facilities/actions"
import { FACILITY_ICONS } from "@/lib/facility-icons"
import type { FacilityItem } from "@/lib/data-store"

type FormState = { mode: "create" } | { mode: "edit"; item: FacilityItem }

export default function FacilityManager({ initial }: { initial: FacilityItem[] }) {
  const [form, setForm] = useState<FormState | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleCreate(fd: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await createFacilityAction(fd)
      if (res.success) {
        setForm(null)
        setSuccess("Facility created")
      } else setError(res.error ?? "Failed to create facility")
    })
  }

  function handleUpdate(id: number, slug: string, existingImage: string, fd: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await updateFacilityAction(id, slug, existingImage, fd)
      if (res.success) {
        setForm(null)
        setSuccess("Facility updated")
      } else setError(res.error ?? "Failed to update facility")
    })
  }

  function handleDelete(id: number, slug: string) {
    if (!confirm("Delete this facility?")) return
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await deleteFacilityAction(id, slug)
      if (res.success) setSuccess("Facility deleted")
      else setError(res.error ?? "Failed to delete facility")
    })
  }

  return (
    <div>
      <PageHeader
        title="Facilities"
        description="Fasilitas kampus — tampil sebagai InteractiveSelector di halaman /facility."
        actions={
          form == null ? (
            <PrimaryButton onClick={() => setForm({ mode: "create" })}>
              <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> New facility
            </PrimaryButton>
          ) : null
        }
      />

      {success && <Banner tone="success" onDismiss={() => setSuccess(null)}>{success}</Banner>}
      {error && <Banner tone="error" onDismiss={() => setError(null)}>{error}</Banner>}

      {form && (
        <FacilityForm
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
        getKey={(f) => f.id}
        empty={
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-slate-500">No facilities yet</p>
            <p className="text-[13px] text-slate-400">Click “New facility” to create the first one.</p>
          </div>
        }
        columns={[
          {
            key: "title",
            header: "Facility",
            render: (f) => (
              <div className="flex items-center gap-3">
                <img src={f.image} alt="" className="h-10 w-16 shrink-0 rounded-md object-cover ring-1 ring-slate-200" />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-slate-900">{f.title}</div>
                  <div className="truncate text-xs text-slate-500">/{f.slug}</div>
                </div>
              </div>
            ),
          },
          {
            key: "icon",
            header: "Icon",
            className: "w-24 text-center",
            render: (f) => <span className="font-mono text-xs text-slate-500">{f.icon}</span>,
          },
          {
            key: "is_active",
            header: "Active",
            className: "w-20 text-center",
            render: (f) => (
              <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + (f.is_active ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-1 ring-slate-200")}>
                {f.is_active ? "Yes" : "No"}
              </span>
            ),
          },
          {
            key: "id",
            header: "ID",
            className: "w-16 text-right font-mono text-xs text-slate-400",
            render: (f) => `#${String(f.id).padStart(3, "0")}`,
          },
          {
            key: "actions",
            header: "",
            className: "w-40 text-right",
            render: (f) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setSuccess(null)
                    setForm({ mode: "edit", item: f })
                  }}
                  className="rounded-md px-2.5 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  Edit
                </button>
                <DangerButton onClick={() => handleDelete(f.id, f.slug)} disabled={pending}>
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

function FacilityForm({
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
  onUpdate: (id: number, slug: string, existingImage: string, fd: FormData) => void
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
    if (isEdit) onUpdate(state.item.id, state.item.slug, defaults?.image ?? "", fd)
    else onCreate(fd)
  }

  return (
    <Card className="mb-6">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">{isEdit ? "Edit facility" : "New facility"}</h2>
          <span className="text-[13px] text-slate-400">{isEdit ? `Editing #${String(state.item.id).padStart(3, "0")}` : "Draft"}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Slug otomatis dari Title.</p>
      </div>
      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-5 px-6 py-6 sm:grid-cols-2">
        <Field label="Title" required htmlFor="fac-title">
          <TextInput id="fac-title" name="title" defaultValue={defaults?.title} placeholder="Perpustakaan" required />
        </Field>
        <Field label="Active" htmlFor="fac-active" className="flex items-center">
          <label htmlFor="fac-active" className="flex items-center gap-2 text-sm text-slate-700">
            <input id="fac-active" type="checkbox" name="is_active" defaultChecked={defaults?.is_active ?? true} className="h-4 w-4 rounded border-slate-300" />
            Active (tampil di halaman /facility)
          </label>
        </Field>
        <Field label="Icon" htmlFor="fac-icon">
          <select
            id="fac-icon"
            name="icon"
            defaultValue={defaults?.icon ?? "FaBuilding"}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
          >
            {Object.keys(FACILITY_ICONS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Short description" htmlFor="fac-short">
          <TextInput id="fac-short" name="short_description" defaultValue={defaults?.short_description} placeholder="Koleksi 50.000+ buku..." />
        </Field>
        <Field label="Description" htmlFor="fac-desc" className="sm:col-span-2">
          <TextArea id="fac-desc" name="description" defaultValue={defaults?.description} placeholder="Detail fasilitas untuk halaman slug..." rows={4} />
        </Field>
        <Field label={isEdit ? "Replace image" : "Cover image"} required={!isEdit} htmlFor="fac-image" className="sm:col-span-2">
          <div className="flex items-start gap-4">
            {preview && <img src={preview} alt="" className="h-20 w-32 shrink-0 rounded-md object-cover ring-1 ring-slate-200" />}
            <FileInput id="fac-image" name="imageFile" accept="image/*" required={!isEdit && !defaults?.image} onChange={handleFileChange} className="flex-1" />
          </div>
        </Field>
        <div className="flex items-center justify-end gap-2 sm:col-span-2">
          <GhostButton onClick={onCancel} disabled={pending}>Cancel</GhostButton>
          <PrimaryButton type="submit" pending={pending}>{isEdit ? "Save changes" : "Create facility"}</PrimaryButton>
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
