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
  Activity,
  MapPin,
  AlertTriangle,
  Edit2,
  Trash2,
  Settings as SettingsIcon,
  History
} from "lucide-react"
import { Asset } from "../../../shared/types"

const MOCK_ASSETS: Asset[] = [
  { id: "AST-001", name: "Delivery Van #12", type: "Vehicle", status: "available", health: 95, location: "San Francisco, CA" },
  { id: "AST-002", name: "Industrial Drone X1", type: "UAV", status: "in-use", health: 82, location: "Oakland, CA" },
  { id: "AST-003", name: "Forklift Alpha", type: "Heavy Machinery", status: "maintenance", health: 45, location: "Warehouse A" },
  { id: "AST-004", name: "Server Rack 04", type: "IT Infrastructure", status: "available", health: 99, location: "Data Center 1" },
  { id: "AST-005", name: "Delivery Van #15", type: "Vehicle", status: "in-use", health: 88, location: "San Jose, CA" },
]

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [assets] = useState<Asset[]>(MOCK_ASSETS)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('view')

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusVariant = (status: Asset['status']) => {
    switch (status) {
      case 'available': return 'success'
      case 'in-use': return 'secondary'
      case 'maintenance': return 'destructive'
      case 'retired': return 'outline'
      default: return 'secondary'
    }
  }

  const getHealthColor = (health: number) => {
    if (health > 80) return 'text-emerald-500'
    if (health > 50) return 'text-amber-500'
    return 'text-destructive'
  }

  const openDrawer = (asset: Asset | null, mode: 'create' | 'edit' | 'view') => {
    setSelectedAsset(asset)
    setDrawerMode(mode)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedAsset(null)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Fleet & Assets"
        description="Monitor physical assets and infrastructure health."
        action={
          <Button className="gap-2" onClick={() => openDrawer(null, 'create')}>
            <Plus className="h-4 w-4" /> Add Asset
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Available: 3</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
            <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
            <span>Alerts: 1</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health</TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No assets found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="cursor-pointer group" onClick={() => openDrawer(asset, 'view')}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{asset.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{asset.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{asset.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(asset.status)} className="capitalize">
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000", asset.health > 80 ? 'bg-emerald-500' : asset.health > 50 ? 'bg-amber-500' : 'bg-destructive')} 
                          style={{ width: `${asset.health}%` }} 
                        />
                      </div>
                      <span className={cn("text-xs font-bold font-mono", getHealthColor(asset.health))}>
                        {asset.health}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {asset.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openDrawer(asset, 'edit')}>
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
        title={drawerMode === 'create' ? 'Add New Asset' : drawerMode === 'edit' ? 'Edit Asset' : 'Asset Overview'}
        description="Specifications and operational status."
        footer={
          drawerMode !== 'view' ? (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeDrawer}>Cancel</Button>
              <Button onClick={closeDrawer}>{drawerMode === 'create' ? 'Register Asset' : 'Save Changes'}</Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="gap-2" onClick={() => setDrawerMode('edit')}>
                <SettingsIcon className="h-4 w-4" /> Config
              </Button>
              <Button className="gap-2">
                <History className="h-4 w-4" /> Maintenance Log
              </Button>
            </div>
          )
        }
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Asset Name</label>
              <Input 
                defaultValue={selectedAsset?.name || ''} 
                disabled={drawerMode === 'view'}
                placeholder="e.g. Delivery Van #12" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Type</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedAsset?.type || 'Vehicle'}
                  disabled={drawerMode === 'view'}
                >
                  <option value="Vehicle">Vehicle</option>
                  <option value="UAV">UAV</option>
                  <option value="Heavy Machinery">Heavy Machinery</option>
                  <option value="IT Infrastructure">IT Infrastructure</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedAsset?.status || 'available'}
                  disabled={drawerMode === 'view'}
                >
                  <option value="available">Available</option>
                  <option value="in-use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Current Location</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  defaultValue={selectedAsset?.location || ''} 
                  disabled={drawerMode === 'view'}
                  placeholder="e.g. Warehouse A"
                  className="pl-9"
                />
              </div>
            </div>
            {drawerMode !== 'create' && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Health Score ({selectedAsset?.health || 0}%)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue={selectedAsset?.health || 100} 
                  disabled={drawerMode === 'view'}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            )}
          </div>

          {drawerMode === 'view' && (
            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Sensor Telemetry</h3>
                <Badge variant="outline" className="text-[10px] uppercase">Live</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Battery/Fuel', value: '88%', status: 'nominal' },
                  { label: 'Temperature', value: '42°C', status: 'nominal' },
                  { label: 'Uptime', value: '14d 6h', status: 'nominal' },
                  { label: 'Load factor', value: '12%', status: 'low' },
                ].map((item, i) => (
                  <div key={i} className="bg-muted/50 p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.label}</p>
                    <p className="text-lg font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  )
}
