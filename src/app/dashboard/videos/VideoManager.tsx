"use client"

import { useRef, useState, useTransition } from "react"
import { Banner } from "@/components/ui/dashboard/banner"
import { Avatar, DataTable } from "@/components/ui/dashboard/data-table"
import { PageHeader, PrimaryButton, DangerButton, GhostButton } from "@/components/ui/dashboard/buttons"
import { Card } from "@/components/ui/dashboard/data-table"
import { Field, TextArea, TextInput } from "@/components/ui/dashboard/form"
import {
  createVideoAction,
  deleteVideoAction,
  updateVideoAction,
} from "@/app/dashboard/videos/actions"
import type { VideoItem } from "@/lib/data-store"

type FormState = { mode: "create" } | { mode: "edit"; item: VideoItem }

export default function VideoManager({ initial }: { initial: VideoItem[] }) {
  const [form, setForm] = useState<FormState | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleCreate(formData: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await createVideoAction(formData)
      if (res.success) {
        setForm(null)
        setSuccess("Video added")
      } else {
        setError(res.error ?? "Failed to create video")
      }
    })
  }

  function handleUpdate(id: number, formData: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await updateVideoAction(id, formData)
      if (res.success) {
        setForm(null)
        setSuccess("Video updated")
      } else {
        setError(res.error ?? "Failed to update video")
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this video?")) return
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await deleteVideoAction(id)
      if (res.success) {
        setSuccess("Video deleted")
      } else {
        setError(res.error ?? "Failed to delete video")
      }
    })
  }

  return (
    <div>
      <PageHeader
        title="Videos"
        description="3D carousel videos shown in the Video section."
        actions={
          form == null ? (
            <PrimaryButton onClick={() => setForm({ mode: "create" })}>
              <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> New video
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
        <VideoForm
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
        getKey={(v) => v.id}
        empty={
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-slate-500">No videos yet</p>
            <p className="text-[12px] text-slate-400">Click &ldquo;New video&rdquo; to add the first one.</p>
          </div>
        }
        columns={[
          {
            key: "thumbnail",
            header: "Thumbnail",
            render: (v) => (
              <div className="h-10 w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-slate-200">
                <img src={v.thumbnail} alt="" className="h-full w-full object-cover" />
              </div>
            ),
          },
          {
            key: "title",
            header: "Title",
            render: (v) => <div className="font-medium text-slate-900 truncate">{v.title}</div>,
          },
          {
            key: "youtube",
            header: "YouTube link",
            render: (v) => (
              <a href={`https://youtu.be/${v.youtube_id}`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-slate-500 hover:text-slate-900 underline">
                youtu.be/{v.youtube_id}
              </a>
            ),
          },
          {
            key: "id",
            header: "ID",
            className: "w-16 text-right font-mono text-[11.5px] text-slate-400",
            render: (v) => `#${String(v.id).padStart(3, "0")}`,
          },
          {
            key: "actions",
            header: "",
            className: "w-36 text-right",
            render: (v) => (
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setSuccess(null)
                    setForm({ mode: "edit", item: v })
                  }}
                  className="rounded-md px-2 py-1 text-[12.5px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Edit
                </button>
                <DangerButton onClick={() => handleDelete(v.id)} disabled={pending}>
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

function VideoForm({
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
  onUpdate: (id: number, fd: FormData) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const isEdit = state.mode === "edit"
  const defaults = isEdit ? state.item : null

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    if (isEdit) {
      onUpdate(state.item.id, fd)
    } else {
      onCreate(fd)
    }
  }

  return (
    <Card className="mb-6">
      <div className="border-b border-slate-100 px-5 py-3.5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
            {isEdit ? "Edit video" : "New video"}
          </h2>
          <span className="text-[12px] text-slate-400">
            {isEdit ? `Editing #${String(state.item.id).padStart(3, "0")}` : "Draft"}
          </span>
        </div>
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-4 px-5 py-5 sm:grid-cols-2"
      >
        <Field label="Title" required htmlFor="video-title">
          <TextInput
            id="video-title"
            name="title"
            defaultValue={defaults?.title}
            placeholder="e.g. Pemberdayaan Remaja Pasir Luwuk"
            required
          />
        </Field>
        <Field label="YouTube link" required htmlFor="video-link" hint="Full link or ID">
          <TextInput
            id="video-link"
            name="youtubeLink"
            defaultValue={defaults ? `https://youtu.be/${defaults.youtube_id}` : ""}
            placeholder="https://youtu.be/xxxx or dQw4w9WgXcQ"
            required
          />
        </Field>
        <div className="flex items-center justify-end gap-2 sm:col-span-2">
          <GhostButton onClick={onCancel} disabled={pending}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit" pending={pending}>
            {isEdit ? "Save changes" : "Create video"}
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
