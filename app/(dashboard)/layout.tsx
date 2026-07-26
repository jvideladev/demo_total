import Header from '@/components/Header'
import MainNav from '@/components/MainNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <Header />
        <MainNav />
      </div>
      <main className="min-h-screen">{children}</main>
    </>
  )
}
