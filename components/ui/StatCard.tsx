interface Props {
  label: string
  value: string | number
  icon: React.ElementType
}

export function StatCard({ label, value, icon: Icon }: Props) {
  return (
    <div className="rounded-lg bg-secondary p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}