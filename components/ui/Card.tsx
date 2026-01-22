interface Props {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: Props) {
  return (
    <div className={`rounded-lg bg-secondary p-4 ${className}`}>
      {children}
    </div>
  )
}