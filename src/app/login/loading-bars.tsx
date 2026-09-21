export default function LoadingBars({
  className = "h-8",
}: {
  className?: string
}) {
  const heights = [
    "h-8",
    "h-6",
    "h-4",
    "h-2",
    "h-4",
    "h-6",
    "h-8",
  ]
  return (
    <div className="flex h-8 items-end space-x-0.5" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-1.5 ${h} rounded-full bg-orange-600 animate-pulse`}
          style={{ animationDelay: `${-0.6 + i * 0.1}s` }}
        />
      ))}
    </div>
  )
}