"use client"

import { useRef, useState, useTransition } from "react"
import { Banner } from "@/components/ui/dashboard/banner"
import {
  DangerButton,
  GhostButton,
  PrimaryButton,
} from "@/components/ui/dashboard/buttons"
import { DataTable } from "@/components/ui/dashboard/data-table"
import {
  Field,
  FileInput,
  TextArea,
  TextInput,
} from "@/components/ui/dashboard/form"
import { PageHeader } from "@/components/ui/dashboard/buttons"
import { Card } from "@/components/ui/dashboard/data-table"
import { cn } from "@/lib/utils"
import {
  createPopupAction,
  deletePopupAction,
  updatePopupAction,
} from "@/app/dashboard/popups/actions"
import type { PopupItem } from "@/lib/data-store"

type FormState = { mode: "create" } | { mode: "edit"; item: PopupItem }
type ActionResult = { success: boolean; error?: string }

const DEFAULT_EVENT_LEAD_TIME_MS = 2 * 24 * 3600 * 1000 // 2 days from now

export default function PopupManager({ initial }: { initial: PopupItem[] }) {
  const [form, setForm] = useState<FormState | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function clearMessages() {
    setError(null)
    setSuccess(null)
  }

  // Runs an action, shows the result, and closes the form on success
  function runAction(
    action: () => Promise<ActionResult>,
    successMessage: string,
    failMessage: string,
  ) {
    clearMessages()
    startTransition(async () => {
      const result = await action()
      if (result.success) {
        setForm(null)
        setSuccess(successMessage)
      } else {
        setError(result.error ?? failMessage)
      }
    })
  }

  function handleCreate(fd: FormData) {
    runAction(
      () => createPopupAction(fd),
      "Popup created",
      "Failed to create popup",
    )
  }

  function handleUpdate(id: number, existingImage: string, fd: FormData) {
    runAction(
      () => updatePopupAction(id, existingImage, fd),
      "Popup updated",
      "Failed to update popup",
    )
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this popup?")) return
    runAction(
      () => deletePopupAction(id),
      "Popup deleted",
      "Failed to delete popup",
    )
  }

  function openEdit(item: PopupItem) {
    clearMessages()
    setForm({ mode: "edit", item })
  }

  return (
    <div>
      <PageHeader
        title="Popups — Event Countdown"
        description="Welcome popup di homepage (EventCountdownCard). Auto-slide jika 2+ active. Cookie 24h hash."
        actions={
          form == null ? (
            <PrimaryButton onClick={() => setForm({ mode: "create" })}>
              <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> New popup
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
        <PopupForm
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
        getKey={(p) => p.id}
        empty={
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-slate-500">No popups yet</p>
            <p className="text-[13px] text-slate-400">
              Click “New popup” — upload Hero-Mobile.png + set event date.
            </p>
          </div>
        }
        columns={[
          {
            key: "image",
            header: "Event",
            render: (p) => <EventCell popup={p} />,
          },
          {
            key: "is_active",
            header: "Active",
            className: "w-20 text-center",
            render: (p) => <ActiveBadge active={p.is_active} />,
          },
          {
            key: "id",
            header: "ID",
            className: "w-16 text-right font-mono text-xs text-slate-400",
            render: (p) => `#${String(p.id).padStart(3, "0")}`,
          },
          {
            key: "actions",
            header: "",
            className: "w-40 text-right",
            render: (p) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="rounded-md px-2.5 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  Edit
                </button>
                <DangerButton
                  onClick={() => handleDelete(p.id)}
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

function EventCell({ popup }: { popup: PopupItem }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={popup.image}
        alt=""
        className="h-14 w-10 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
      />
      <div className="min-w-0">
        <div className="truncate text-[13px] font-semibold text-slate-900">
          {popup.title}
        </div>
        <div className="truncate text-xs text-slate-500">
          {popup.event_date
            ? new Date(popup.event_date).toLocaleDateString()
            : "-"}{" "}
          {/* • {popup.attendees} attending */}
        </div>
        <div className="truncate text-xs text-slate-400">
          {popup.description.slice(0, 40)}
        </div>
      </div>
    </div>
  )
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
      )}
    >
      {active ? "Yes" : "No"}
    </span>
  )
}

function PopupForm({
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
    if (isEdit) onUpdate(state.item.id, defaults?.image ?? "", fd)
    else onCreate(fd)
  }

  const defaultDate = defaults?.event_date
    ? toDatetimeLocal(new Date(defaults.event_date))
    : ""

  return (
    <Card className="mb-6">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
            {isEdit ? "Edit popup" : "New popup"}
          </h2>
          <span className="text-[13px] text-slate-400">
            {isEdit
              ? `Editing #${String(state.item.id).padStart(3, "0")}`
              : "Draft"}
          </span>
        </div>
        {/* <p className="mt-1 text-xs text-slate-500">
          Hanya <strong>gambar wajib</strong> — field lain opsional. Kosongkan = tidak tampil di popup. Portrait 720×960, default <code>/images/Hero-Mobile.png</code>.
        </p> */}
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-5 px-6 py-6"
      >
        <Field label="Event title (opsional)" htmlFor="popup-title">
          <TextInput
            id="popup-title"
            name="title"
            defaultValue={defaults?.title ?? ""}
            placeholder=""
          />
        </Field>
        <Field label="Description (opsional)" htmlFor="popup-desc">
          <TextArea
            id="popup-desc"
            name="description"
            defaultValue={defaults?.description}
            placeholder=""
            rows={2}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Event date (opsional)" htmlFor="popup-date" hint="">
            <TextInput
              id="popup-date"
              name="event_date"
              type="datetime-local"
              defaultValue={defaultDate}
            />
          </Field>
          {/* <Field label="Attendees"  htmlFor="popup-att">
            <TextInput
              id="popup-att"
              name="attendees"
              type="number"
              defaultValue={String(defaults?.attendees ?? 42)}
              min="1"
              required
            />
          </Field> */}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Button label (opsional)" htmlFor="popup-label">
            <TextInput
              id="popup-label"
              name="button_label"
              defaultValue={defaults?.button_label ?? ""}
              placeholder=""
            />
          </Field>
          <Field label="Button href (opsional)" htmlFor="popup-href">
            <TextInput
              id="popup-href"
              name="button_href"
              defaultValue={defaults?.button_href ?? ""}
              placeholder=""
              
            />
          </Field>
        </div>
        <Field
          label={isEdit ? "Replace portrait image" : "Portrait image"}
          required={!isEdit}
          htmlFor="popup-image"
        >
          <div className="flex items-start gap-4">
            {preview && (
              <img
                src={preview}
                alt=""
                className="h-28 w-20 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
              />
            )}
            <FileInput
              id="popup-image"
              name="imageFile"
              accept="image/*"
              required={!isEdit && !defaults?.image}
              onChange={handleFileChange}
              className="flex-1"
            />
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={defaults?.is_active ?? true}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active (tampil di homepage popup center)
        </label>
        <div className="flex items-center justify-end gap-2">
          <GhostButton onClick={onCancel} disabled={pending}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit" pending={pending}>
            {isEdit ? "Save changes" : "Create popup"}
          </PrimaryButton>
        </div>
      </form>
    </Card>
  )
}

// Formats a Date for an <input type="datetime-local"> value
function toDatetimeLocal(date: Date): string {
  return date.toISOString().slice(0, 16)
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
