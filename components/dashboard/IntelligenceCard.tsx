interface Item {
  label: string
  value: string
  highlight?: 'success' | 'danger' | 'accent'
}

const highlightMap = {
  success: 'text-green-400',
  danger: 'text-red-400',
  accent: 'text-accent',
}

export function IntelligenceCard({
  title,
  items,
}: {
  title: string
  items: Item[]
}) {
  return (
    <div className="rounded-lg bg-secondary p-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-md bg-primary/40 p-4">
            <p className="text-xs text-gray-400">{item.label}</p>
            <p
              className={`mt-1 text-xl font-bold ${
                item.highlight ? highlightMap[item.highlight] : ''
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex h-24 items-center justify-center rounded-md bg-primary/30 text-xs text-gray-400">
        Chart placeholder
      </div>
    </div>
  )
}