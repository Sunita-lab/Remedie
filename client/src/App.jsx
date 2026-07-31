import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-4xl font-bold text-foreground">
        Remedie 🏥
      </h1>
      <p className="text-muted-foreground">Every Patient. Every Journey. Connected.</p>
      <Button>Schedule Appointment</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="destructive">Cancel</Button>
    </div>
  )
}

export default App