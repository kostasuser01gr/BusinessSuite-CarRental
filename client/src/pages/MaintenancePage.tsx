import { useState } from "react"
import { cn } from "../utils/cn"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"
import { Drawer } from "../components/ui/Drawer"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/Table"
import { 
  Search, 
  Plus, 
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Calendar as CalendarIcon,
  Wrench,
  User as UserIcon,
  MessageSquare,
  Edit2
} from "lucide-react"
import { MaintenanceRecord } from "../../../shared/types"

const MOCK_MAINTENANCE: MaintenanceRecord[] = [
  { id: "MNT-2001", assetId: "AST-003", assetName: "Forklift Alpha", issue: "Hydraulic leak in main piston", priority: "high", status: "in-progress", dueDate: "2026-03-22" },
  { id: "MNT-2002", assetId: "AST-002", assetName: "Industrial Drone X1", issue: "Routine propeller replacement", priority: "low", status: "scheduled", dueDate: "2026-03-28" },
  { id: "MNT-2003", assetId: "AST-005", assetName: "Delivery Van #15", issue: "Brake pad wear sensor triggered", priority: "critical", status: "overdue", dueDate: "2026-03-18" },
  { id: "MNT-2004", assetId: "AST-004", assetName: "Server Rack 04", issue: "Cooling fan #3 failure", priority: "medium", status: "scheduled", dueDate: "2026-03-25" },
  { id: "MNT-2005", assetId: "AST-001", assetName: "Delivery Van #12", issue: "Oil change and tire rotation", priority: "low", status: "completed", dueDate: "2026-03-10" },
]

export default function MaintenancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [records] = useState<MaintenanceRecord[]>(MOCK_MAINTENANCE)
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('view')

  const filteredRecords = records.filter(r => 
    r.assetName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.issue.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityVariant = (priority: MaintenanceRecord['priority']) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: MaintenanceRecord['status']) => {
    switch (status) {
      case 'in-progress': return <Clock className="h-4 w-4 text-primary" />
      case 'scheduled': return <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'overdue': return <AlertCircle className="h-4 w-4 text-destructive" />
      default: return null
    }
  }

  const openDrawer = (record: MaintenanceRecord | null, mode: 'create' | 'edit' | 'view') => {
    setSelectedRecord(record)
    setDrawerMode(mode)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedRecord(null)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Maintenance"
        description="Track equipment repairs and scheduled service."
        action={
          <Button className="gap-2" onClick={() => openDrawer(null, 'create')}>
            <Plus className="h-4 w-4" /> New Ticket
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search maintenance logs..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>1 Overdue</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Asset / Issue</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id} className="cursor-pointer group" onClick={() => openDrawer(record, 'view')}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{record.assetName}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{record.issue}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(record.priority)} className="capitalize">
                      {record.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className="text-sm text-foreground capitalize">{record.status.replace('-', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    <span className={cn(record.status === 'overdue' && "text-destructive font-semibold")}>
                      {new Date(record.dueDate).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openDrawer(record, 'edit')}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={drawerMode === 'create' ? 'New Ticket' : drawerMode === 'edit' ? 'Edit Ticket' : 'Ticket Details'}
        description="Equipment repair and service coordination."
        footer={
          drawerMode !== 'view' ? (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeDrawer}>Cancel</Button>
              <Button onClick={closeDrawer}>{drawerMode === 'create' ? 'Create Ticket' : 'Save Changes'}</Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="gap-2" onClick={() => setDrawerMode('edit')}>
                <Edit2 className="h-4 w-4" /> Edit
              </Button>
              <Button className="gap-2">
                <CheckCircle2 className="h-4 w-4" /> Resolve Ticket
              </Button>
            </div>
          )
        }
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Asset</label>
              <div className="relative">
                <Wrench className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  defaultValue={selectedRecord?.assetName || ''} 
                  disabled={drawerMode === 'view'}
                  placeholder="Select asset..."
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Issue Description</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={selectedRecord?.issue || ''} 
                disabled={drawerMode === 'view'}
                placeholder="Describe the technical problem..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Priority</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedRecord?.priority || 'medium'}
                  disabled={drawerMode === 'view'}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input 
                  type="date" 
                  defaultValue={selectedRecord?.dueDate || ''} 
                  disabled={drawerMode === 'view'}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Assigned Technician</label>
              <div className="relative">
                <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  defaultValue="John Smith" 
                  disabled={drawerMode === 'view'}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {drawerMode === 'view' && (
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold mb-4">Resolution Notes</h3>
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Admin</span>
                    <span className="text-[10px] text-muted-foreground">Today, 9:45 AM</span>
                  </div>
                  <p className="text-sm">Spare parts have been ordered. ETA 2 days.</p>
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Add a comment..." className="pl-9" />
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  )
}
