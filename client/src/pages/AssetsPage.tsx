import { useState, useMemo, useEffect } from "react"
import { cn } from "../utils/cn"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"
import { Drawer } from "../components/ui/Drawer"
import { Skeleton } from "../components/ui/Skeleton"
import { Sparkline } from "../components/ui/Sparkline"
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
  History,
  TrendingUp,
  Battery,
  Thermometer,
  Zap,
  Gauge,
  Check,
  ShieldAlert
} from "lucide-react"
import { Asset, AssetStatus } from "../../../shared/types"
import { useAssets } from "../hooks/useAssets"
import { animatePulse } from "../animations"
import { useAuth } from "../providers/AuthProvider"
import { hasPermission } from "../lib/permissions"

export default function AssetsPage() {
  const { assets, isLoading, createAsset, updateAsset, deleteAsset } = useAssets()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('view')

  const canCreate = hasPermission(user, 'ASSET', 'CREATE')

  // Form state
  const [formData, setFormData] = useState<Partial<Asset>>({})

  const filteredAssets = useMemo(() => assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  ), [assets, searchTerm])

  const stats = useMemo(() => {
    return {
      available: assets.filter(a => a.status === 'available').length,
      maintenance: assets.filter(a => a.status === 'maintenance').length,
      avgHealth: assets.length ? Math.round(assets.reduce((acc, a) => acc + a.health, 0) / assets.length) : 0,
      alerts: assets.filter(a => a.health < 60).length
    }
  }, [assets])

  const getStatusVariant = (status: AssetStatus) => {
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
    // Check update permission for edit mode
    if (mode === 'edit' && !hasPermission(user, 'ASSET', 'UPDATE', asset)) {
      alert("You do not have permission to edit this asset.")
      return
    }
    
    setSelectedAsset(asset)
    setFormData(asset || { name: '', type: 'Vehicle', status: 'available', health: 100, location: '' })
    setDrawerMode(mode)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedAsset(null)
  }

  const handleSave = () => {
    if (drawerMode === 'create') {
      createAsset(formData as Omit<Asset, 'id'>)
    } else if (selectedAsset) {
      updateAsset({ ...selectedAsset, ...formData } as Asset)
    }
    closeDrawer()
  }

  const handleDelete = (id: string) => {
    const asset = assets.find(a => a.id === id)
    if (!hasPermission(user, 'ASSET', 'DELETE', asset)) {
      alert("Only administrators can delete assets.")
      return
    }
    if (confirm('Are you sure you want to retire this asset?')) {
      deleteAsset(id)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Fleet & Assets"
        description="Monitor physical assets and infrastructure health."
        action={
          canCreate && (
            <Button className="gap-2 shadow-lg shadow-primary/20" onClick={(e) => { animatePulse(e.currentTarget); openDrawer(null, 'create'); }}>
              <Plus className="h-4 w-4" /> Add Asset
            </Button>
          )
        }
      />

      {/* Permission Awareness Banner */}
      {user?.role === 'viewer' && (
        <div className="bg-muted/50 border border-border p-3 rounded-lg flex items-center gap-3 text-xs text-muted-foreground">
          <ShieldAlert className="h-4 w-4" />
          <span>You are in <strong>Read-Only</strong> mode. Actions are restricted based on your role.</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4 mb-2">
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Check className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Available</p>
            <p className="text-xl font-bold">{stats.available}</p>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Zap className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Avg Health</p>
            <p className="text-xl font-bold">{stats.avgHealth}%</p>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="p-2 bg-destructive/10 rounded-lg text-destructive"><AlertTriangle className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Health Alerts</p>
            <p className="text-xl font-bold">{stats.alerts}</p>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary"><TrendingUp className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Utilization</p>
            <p className="text-xl font-bold">72%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-9 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[250px]">Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health</TableHead>
              <TableHead className="hidden xl:table-cell">Live Performance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  No assets found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="cursor-pointer group hover:bg-muted/30 transition-colors" onClick={() => openDrawer(asset, 'view')}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center border",
                        asset.health < 60 ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-muted border-border text-muted-foreground"
                      )}>
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{asset.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">{asset.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-medium">{asset.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(asset.status)} className="capitalize font-bold text-[10px]">
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000", asset.health > 80 ? 'bg-emerald-500' : asset.health > 50 ? 'bg-amber-500' : 'bg-destructive')} 
                          style={{ width: `${asset.health}%` }} 
                        />
                      </div>
                      <span className={cn("text-xs font-bold font-mono min-w-[3ch]", getHealthColor(asset.health))}>
                        {asset.health}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-4">
                      <Sparkline data={[40, 45, 42, 50, 48, 55, 52, 60]} color={asset.health > 60 ? "#10b981" : "#ef4444"} width={80} height={20} />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Stability</span>
                        <span className="text-xs font-bold text-foreground">92%</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {hasPermission(user, 'ASSET', 'UPDATE', asset) && (
                        <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-primary" onClick={() => openDrawer(asset, 'edit')}>
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {hasPermission(user, 'ASSET', 'DELETE', asset) && (
                        <button className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive" onClick={() => handleDelete(asset.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
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
        title={drawerMode === 'create' ? 'Add New Asset' : drawerMode === 'edit' ? 'Edit Asset' : 'Asset Detail'}
        description="Operational parameters and live telemetry."
        footer={
          drawerMode !== 'view' ? (
            <div className="flex gap-3 justify-end w-full">
              <Button variant="outline" onClick={closeDrawer} className="flex-1 sm:flex-none">Cancel</Button>
              <Button onClick={handleSave} className="flex-1 sm:flex-none">{drawerMode === 'create' ? 'Register Asset' : 'Save Changes'}</Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end w-full">
              {hasPermission(user, 'ASSET', 'UPDATE', selectedAsset) && (
                <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={() => setDrawerMode('edit')}>
                  <Edit2 className="h-4 w-4" /> Edit
                </Button>
              )}
              <Button className="gap-2 flex-1 sm:flex-none">
                <History className="h-4 w-4" /> Logs
              </Button>
            </div>
          )
        }
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Basic Information</label>
              <div className="grid gap-4 p-4 rounded-xl border bg-muted/30">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium">Asset Name</label>
                  <Input 
                    value={formData.name || ''} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={drawerMode === 'view'}
                    placeholder="e.g. Delivery Van #12" 
                    className="bg-background border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium">Type</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.type || 'Vehicle'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      disabled={drawerMode === 'view'}
                    >
                      <option value="Vehicle">Vehicle</option>
                      <option value="UAV">UAV</option>
                      <option value="Heavy Machinery">Heavy Machinery</option>
                      <option value="IT Infrastructure">IT Infrastructure</option>
                    </select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium">Status</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.status || 'available'}
                      onChange={(e) => setFormData({...formData, status: e.target.value as AssetStatus})}
                      disabled={drawerMode === 'view'}
                    >
                      <option value="available">Available</option>
                      <option value="in-use">In Use</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium">Current Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={formData.location || ''} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      disabled={drawerMode === 'view'}
                      placeholder="e.g. Warehouse A"
                      className="pl-9 bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {drawerMode !== 'create' && (
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Asset Health & Degradation</label>
                <div className="p-4 rounded-xl border bg-muted/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Score</span>
                    <span className={cn("text-sm font-bold font-mono", getHealthColor(formData.health || 0))}>
                      {formData.health || 0}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={formData.health || 0}
                    onChange={(e) => setFormData({...formData, health: parseInt(e.target.value)})}
                    disabled={drawerMode === 'view'}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-background rounded-lg border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Predicted Life</p>
                      <p className="text-sm font-bold">14 Months</p>
                    </div>
                    <div className="text-center p-2 bg-background rounded-lg border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Risk Level</p>
                      <p className="text-sm font-bold text-emerald-500">Low</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {drawerMode === 'view' && selectedAsset && (
            <div className="pt-6 border-t border-border space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Live Sensor Data
                </h3>
                <Badge variant="outline" className="text-[10px] uppercase font-bold bg-emerald-500/5 text-emerald-500 border-emerald-500/20">Active Stream</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Battery', value: '88%', icon: Battery, color: 'text-blue-500' },
                  { label: 'Thermal', value: '42°C', icon: Thermometer, color: 'text-amber-500' },
                  { label: 'Energy', value: '1.2kW', icon: Zap, color: 'text-emerald-500' },
                  { label: 'Engine', value: 'Nominal', icon: Gauge, color: 'text-primary' },
                ].map((item, i) => (
                  <div key={i} className="bg-muted/30 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center justify-between mb-2">
                      <item.icon className={cn("h-4 w-4", item.color)} />
                      <div className="h-1.5 w-8 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary/20 animate-pulse" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{item.label}</p>
                    <p className="text-lg font-black font-mono">{item.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 rounded-xl border bg-primary/5 border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  <span className="text-xs font-bold text-primary">AI Insight</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Based on current performance trends, this {selectedAsset.type.toLowerCase()} is operating at 12% higher efficiency than the fleet average. No maintenance required for the next 45 days.
                </p>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  )
}
