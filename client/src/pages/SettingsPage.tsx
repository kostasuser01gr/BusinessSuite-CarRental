import { SectionHeader } from "../components/ui/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { useState } from "react"
import { usePWA } from "../hooks/usePWA"
import { useWebAuthn } from "../hooks/useWebAuthn"
import { usePreferences, Theme, Density } from "../providers/PreferencesProvider"
import { useAuditLogs } from "../hooks/useAuditLogs"
import { useAuth } from "../providers/AuthProvider"
import { 
  Laptop, 
  Smartphone, 
  Fingerprint, 
  ShieldCheck, 
  Bell, 
  Layout, 
  Palette,
  Download,
  Check,
  Eye,
  EyeOff,
  GripVertical,
  Navigation,
  Keyboard,
  ShieldAlert,
  Search,
  User as UserIcon,
  Shield
} from "lucide-react"
import { cn } from "../utils/cn"
import { Skeleton } from "../components/ui/Skeleton"
import { Badge } from "../components/ui/Badge"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const { isInstallable, installApp } = usePWA()
  const { isSupported, isPlatformAuthenticatorAvailable, registerCredential, loading: webAuthnLoading } = useWebAuthn()
  const { data: auditLogs, isLoading: auditLoading } = useAuditLogs()
  const { user, setUser } = useAuth()
  
  const { 
    theme, setTheme, 
    density, setDensity, 
    widgets, setWidgets,
    landingPage, setLandingPage,
    notifications, setNotifications,
    shortcutsEnabled, setShortcutsEnabled
  } = usePreferences()

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w))
  }

  const switchRole = (role: string) => {
    if (user) {
      setUser({ ...user, role: role as any })
    }
  }

  const getWidgetName = (id: string) => {
    switch (id) {
      case 'kpi': return 'KPI Overview'
      case 'tasks': return 'Pending Tasks'
      case 'notes': return 'Quick Notes'
      case 'assistant': return 'AI Assistant'
      case 'timeline': return 'Activity Timeline'
      case 'insights': return 'AI Insights'
      default: return id
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Settings"
        description="Manage your account settings, device security, and preferences."
      />
      
      <Tabs>
        <TabsList className="mb-4 overflow-x-auto flex-nowrap">
          <TabsTrigger active={activeTab === "general"} onClick={() => setActiveTab("general")}>
            General
          </TabsTrigger>
          <TabsTrigger active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")}>
            Appearance
          </TabsTrigger>
          <TabsTrigger active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </TabsTrigger>
          <TabsTrigger active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")}>
            Notifications
          </TabsTrigger>
          <TabsTrigger active={activeTab === "security"} onClick={() => setActiveTab("security")}>
            Security & Devices
          </TabsTrigger>
          <TabsTrigger active={activeTab === "audit"} onClick={() => setActiveTab("audit")}>
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent active={activeTab === "general"}>
          <div className="flex flex-col gap-6">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <Input defaultValue={user?.name} className="bg-background border-input focus:border-primary transition-colors" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input defaultValue={user?.email} type="email" className="bg-background border-input focus:border-primary transition-colors" />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border px-6 py-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
              </CardFooter>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Role Emulation (ABAC Testing)
                </CardTitle>
                <CardDescription>Switch roles to test Attribute-Based Access Control logic.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['admin', 'manager', 'technician', 'viewer'].map((r) => (
                    <Button 
                      key={r} 
                      variant={user?.role === r ? "default" : "outline"}
                      className="capitalize h-9 text-xs font-bold"
                      onClick={() => switchRole(r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-primary" />
                  Shortcuts & Accessibility
                </CardTitle>
                <CardDescription>Configure keyboard-driven productivity tools.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Keyboard Shortcuts</h4>
                    <p className="text-xs text-muted-foreground">Enable global hotkeys like Cmd+K and '?'.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={shortcutsEnabled}
                    onChange={(e) => setShortcutsEnabled(e.target.checked)}
                    className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary accent-primary transition-colors"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Navigation
                </CardTitle>
                <CardDescription>Choose where you land after logging in.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">Default Landing Page</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={landingPage}
                    onChange={(e) => setLandingPage(e.target.value)}
                  >
                    <option value="/dashboard">Dashboard</option>
                    <option value="/customers">Customers</option>
                    <option value="/bookings">Bookings</option>
                    <option value="/assets">Fleet & Assets</option>
                    <option value="/knowledge">Knowledge</option>
                    <option value="/workspace">Workspace</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "appearance"}>
          <div className="flex flex-col gap-6">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  Theme
                </CardTitle>
                <CardDescription>Choose how AdaptiveAI looks on your device.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex flex-col items-center gap-3 rounded-lg border p-4 transition-all ${
                        theme === t ? 'border-primary bg-primary/10' : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      <div className={`h-12 w-full rounded ${t === 'light' ? 'bg-zinc-200' : t === 'dark' ? 'bg-zinc-800' : 'bg-gradient-to-r from-zinc-200 to-zinc-800'}`} />
                      <span className="text-sm font-medium capitalize text-foreground">{t}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-muted-foreground" />
                  Layout Density
                </CardTitle>
                <CardDescription>Adjust the density of the user interface.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {(['compact', 'comfortable', 'spacious'] as Density[]).map((d) => (
                    <Button
                      key={d}
                      variant={density === d ? "default" : "outline"}
                      onClick={() => setDensity(d)}
                      className={`capitalize transition-colors ${density === d ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-input text-foreground hover:bg-accent'}`}
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "dashboard"}>
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-muted-foreground" />
                Dashboard Layout
              </CardTitle>
              <CardDescription>Toggle which modules appear on your dashboard. Reordering can be done directly on the dashboard page.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...widgets].sort((a, b) => a.order - b.order).map(w => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-md border border-border bg-background shadow-sm">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{getWidgetName(w.id)}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleWidget(w.id)}
                      className={w.visible ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground"}
                    >
                      {w.visible ? <><Eye className="h-4 w-4 mr-2" /> Visible</> : <><EyeOff className="h-4 w-4 mr-2" /> Hidden</>}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent active={activeTab === "notifications"}>
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Control how you receive updates and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-foreground">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive reports and summaries via email.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary accent-primary transition-colors"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-foreground">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Get instant alerts on your desktop or mobile.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary accent-primary transition-colors"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-foreground">Security Alerts</h4>
                  <p className="text-sm text-muted-foreground">Important notices about your account security.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.security}
                  onChange={(e) => setNotifications({...notifications, security: e.target.checked})}
                  className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary accent-primary transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
              Changes are saved automatically to your device.
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent active={activeTab === "security"}>
          <div className="flex flex-col gap-6">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-primary" />
                  Biometric Authentication
                </CardTitle>
                <CardDescription>
                  Use your device's fingerprint or face recognition to sign in securely.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isSupported ? (
                  <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground border border-border">
                    WebAuthn is not supported by your current browser or device.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/50 group shadow-sm">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">Passkeys & Biometrics</p>
                          <p className="text-xs text-muted-foreground">
                            {isPlatformAuthenticatorAvailable 
                              ? "Platform authenticator detected." 
                              : "No platform authenticator detected, but security keys are supported."}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={async () => {
                          try {
                            const res = await registerCredential();
                            if (res.success) alert('Passkey registered successfully (Architectural Flow)');
                          } catch (e: any) {
                            alert(e.message);
                          }
                        }} 
                        className="border-border hover:bg-accent shadow-sm"
                        disabled={webAuthnLoading}
                      >
                        {webAuthnLoading ? 'Processing...' : 'Setup'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  Device Management
                </CardTitle>
                <CardDescription>Manage your trusted devices and active sessions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-foreground">Remember this device</h4>
                    <p className="text-sm text-muted-foreground">Stay logged in on this browser for 30 days.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary accent-primary transition-colors"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">Current Device Name</label>
                  <div className="flex gap-2">
                    <Input defaultValue="Admin's MacBook Pro" className="bg-background border-input focus:border-primary transition-colors shadow-sm" />
                    <Button variant="outline">Rename</Button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold">Active Sessions</h4>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/50 group shadow-sm">
                    <div className="flex items-center gap-3">
                      <Laptop className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">MacBook Pro - Chrome</p>
                        <p className="text-xs text-muted-foreground">Current session • San Francisco, CA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <Check className="h-3 w-3" />
                      Active
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border px-6 py-4">
                <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors">
                  Sign out from all other devices
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Ensure your account is using a long, random password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-background border-input focus:border-primary transition-colors shadow-sm" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-background border-input focus:border-primary transition-colors shadow-sm" />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border px-6 py-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Update Password</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "audit"}>
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  Security Audit Ledger
                </CardTitle>
                <CardDescription>Immutable record of all critical system actions.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border bg-background overflow-hidden shadow-inner">
                <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <div className="col-span-3">Timestamp</div>
                  <div className="col-span-2">Actor</div>
                  <div className="col-span-2">Action</div>
                  <div className="col-span-3">Entity</div>
                  <div className="col-span-2">Origin</div>
                </div>
                <div className="divide-y divide-border max-h-[500px] overflow-y-auto custom-scrollbar">
                  {auditLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-4 w-full" /></div>)
                  ) : auditLogs?.map((log) => (
                    <div key={log.id} className="grid grid-cols-12 gap-4 p-4 text-xs items-center group hover:bg-muted/30 transition-colors">
                      <div className="col-span-3 text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleString()}</div>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary uppercase">
                          {log.actor.charAt(0)}
                        </div>
                        <span className="font-semibold truncate">{log.actor}</span>
                      </div>
                      <div className="col-span-2">
                        <Badge variant={log.action === 'DELETE' ? 'destructive' : log.action === 'CREATE' ? 'success' : 'secondary'} className="text-[9px] font-black tracking-tighter">
                          {log.action}
                        </Badge>
                      </div>
                      <div className="col-span-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{log.entityType}</span>
                          <span className="text-[9px] text-muted-foreground font-mono uppercase">{log.entityId}</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-muted-foreground font-mono">{log.ip}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t border-border px-6 py-4 flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">Showing last 100 security events.</p>
              <div className="flex items-center gap-2">
                <Search className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">View Advanced Analytics</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
