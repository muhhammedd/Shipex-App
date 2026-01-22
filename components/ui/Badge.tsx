interface Props {
  label: string
  variant?: 'success' | 'warning' | 'error' | 'info'
}

const variants = {
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  error: 'bg-red-500/20 text-red-400',
  info: 'bg-blue-500/20 text-blue-400',
}

export function Badge({ label, variant = 'info' }: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {label}
    </span>
  )
}