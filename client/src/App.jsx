import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }} className="text-4xl font-bold">
        Remedie 🏥
      </h1>
      <p style={{ color: 'var(--color-muted)' }}>Every Patient. Every Journey. Connected.</p>
      <Button 
  style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-button)', color: '#FFFFFF' }}
>
  Schedule Appointment
</Button>
    </div>
  )
}

export default App