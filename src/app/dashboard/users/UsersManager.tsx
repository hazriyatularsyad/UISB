"use client"

import { useState, useTransition } from "react"
import { Banner } from "@/components/ui/dashboard/banner"
import { DataTable } from "@/components/ui/dashboard/data-table"
import { PageHeader, PrimaryButton, DangerButton, GhostButton } from "@/components/ui/dashboard/buttons"
import { Card } from "@/components/ui/dashboard/data-table"
import { Field, TextInput } from "@/components/ui/dashboard/form"
import { createUserAction, deleteUserAction } from "@/app/dashboard/users/actions"
import type { UserRow } from "@/lib/users"

export default function UsersManager({ initial }: { initial: UserRow[] }) {
  const [formOpen, setFormOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleCreate(formData: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await createUserAction(formData)
      if (res.success) {
        setFormOpen(false)
        setSuccess("Akun berhasil dibuat")
      } else {
        setError(res.error ?? "Gagal membuat akun")
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm("Hapus akun ini?")) return
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const res = await deleteUserAction(id)
      if (res.success) {
        setSuccess("Akun dihapus")
      } else {
        setError(res.error ?? "Gagal menghapus akun")
      }
    })
  }

  return (
    <div>
      <PageHeader
        title="Sign Up"
        description="Buat dan kelola akun admin dashboard."
        actions={
          !formOpen ? (
            <PrimaryButton onClick={() => setFormOpen(true)}>
              <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> New account
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

      {formOpen && (
        <SignUpForm
          pending={pending}
          onCancel={() => {
            setFormOpen(false)
            setError(null)
          }}
          onCreate={handleCreate}
        />
      )}

      <DataTable
        rows={initial}
        getKey={(u) => u.id}
        empty={
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-slate-500">Belum ada akun tambahan</p>
            <p className="text-[13px] text-slate-400">
              Klik &ldquo;New account&rdquo; untuk mendaftarkan akun baru.
            </p>
          </div>
        }
        columns={[
          {
            key: "username",
            header: "Username",
            render: (u) => (
              <span className="font-medium text-slate-900">{u.username}</span>
            ),
          },
          {
            key: "created_at",
            header: "Dibuat",
            className: "text-slate-500",
            render: (u) =>
              new Date(u.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
          },
          {
            key: "id",
            header: "ID",
            className: "w-16 text-right font-mono text-[12px] text-slate-400",
            render: (u) => `#${String(u.id).padStart(3, "0")}`,
          },
          {
            key: "actions",
            header: "",
            className: "w-28 text-right",
            render: (u) => (
              <div className="flex items-center justify-end">
                <DangerButton onClick={() => handleDelete(u.id)} disabled={pending}>
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

function SignUpForm({
  pending,
  onCancel,
  onCreate,
}: {
  pending: boolean
  onCancel: () => void
  onCreate: (fd: FormData) => void
}) {
  return (
    <Card className="mb-6">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
            New account
          </h2>
          <span className="text-[13px] text-slate-400">Draft</span>
        </div>
      </div>
      <form
        action={(fd) => onCreate(fd)}
        className="grid gap-5 px-6 py-6 sm:grid-cols-2"
      >
        <Field label="Username" required htmlFor="user-username">
          <TextInput
            id="user-username"
            name="username"
            placeholder="mis. admin2"
            autoComplete="off"
            required
          />
        </Field>
        <Field label="Password" required htmlFor="user-password">
          <TextInput
            id="user-password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>
        <div className="flex items-center justify-end gap-2 sm:col-span-2">
          <GhostButton onClick={onCancel} disabled={pending} type="button">
            Cancel
          </GhostButton>
          <PrimaryButton type="submit" pending={pending}>
            Create account
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
