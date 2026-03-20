import { SectionHeader } from "../components/ui/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Workspace"
        description="Manage your projects, teams, and integrations."
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Alpha Project</CardTitle>
            <CardDescription>Main development track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 w-full bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center text-sm text-zinc-500">
              Active
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Beta Marketing</CardTitle>
            <CardDescription>Q3 campaign assets</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-24 w-full bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center text-sm text-zinc-500">
              Paused
            </div>
          </CardContent>
        </Card>
        <Card className="border-dashed border-zinc-700 bg-transparent flex items-center justify-center hover:bg-zinc-900/50 cursor-pointer transition-colors">
          <CardContent className="pt-6">
            <span className="text-sm font-medium text-zinc-400">+ Create Project</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
