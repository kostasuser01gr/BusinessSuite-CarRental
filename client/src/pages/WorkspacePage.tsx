import { SectionHeader } from "../components/ui/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Plus } from "lucide-react"

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Workspace"
        description="Manage your projects, teams, and integrations."
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors duration-300">
          <CardHeader>
            <CardTitle>Alpha Project</CardTitle>
            <CardDescription>Main development track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 w-full bg-muted/50 rounded-lg border border-border flex items-center justify-center text-sm text-muted-foreground group hover:text-foreground transition-colors">
              Active
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors duration-300">
          <CardHeader>
            <CardTitle>Beta Marketing</CardTitle>
            <CardDescription>Q3 campaign assets</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-24 w-full bg-muted/50 rounded-lg border border-border flex items-center justify-center text-sm text-muted-foreground group hover:text-foreground transition-colors">
              Paused
            </div>
          </CardContent>
        </Card>
        <button className="rounded-xl border border-dashed border-border bg-transparent flex flex-col items-center justify-center p-6 hover:bg-accent/50 hover:border-primary/50 cursor-pointer transition-all duration-300 group">
          <div className="p-2 bg-muted rounded-full text-muted-foreground group-hover:text-primary transition-colors mb-2">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Create Project</span>
        </button>
      </div>
    </div>
  )
}
