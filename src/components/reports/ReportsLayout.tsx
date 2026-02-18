import { ReactNode } from 'react'

interface ReportsLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function ReportsLayout({ title, subtitle, children }: ReportsLayoutProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

export default ReportsLayout
