// Auth is handled by middleware.ts — this layout is a passthrough
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
