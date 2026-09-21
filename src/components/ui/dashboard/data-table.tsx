import { useState, type ReactNode } from "react"

export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={
        "rounded-lg border border-slate-200 bg-white shadow-sm " + className
      }
    >
      {children}
    </div>
  )
}

const PAGE_SIZE = 10

export function DataTable<T>({
  columns,
  rows,
  empty,
  getKey,
}: {
  columns: { key: string; header: ReactNode; className?: string; render: (row: T) => ReactNode }[]
  rows: T[]
  empty: ReactNode
  getKey: (row: T) => string | number
}) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageRows = rows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-[14.5px] text-slate-700">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-slate-500 backdrop-blur">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={"px-4 py-3 " + (c.className ?? "")}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-14 text-center text-[14.5px] text-slate-400"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={getKey(row)}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={"px-4 py-3.5 align-middle " + (c.className ?? "")}
                    >
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {rows.length > PAGE_SIZE ? (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-2.5">
          <p className="text-[12px] text-slate-500">
            {safePage * PAGE_SIZE + 1}-{Math.min(rows.length, (safePage + 1) * PAGE_SIZE)} of {rows.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 text-[13px] tabular-nums text-slate-500">
              {safePage + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function Avatar({
  src,
  alt,
  size = 36,
  rounded = "full",
}: {
  src: string
  alt: string
  size?: number
  rounded?: "full" | "md"
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={
        "shrink-0 object-cover ring-1 ring-slate-200 " +
        (rounded === "full" ? "rounded-full" : "rounded-md")
      }
      style={{ width: size, height: size }}
    />
  )
}
