import { SectionHeader } from "../components/ui/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { useState } from "react"
import { usePWA } from "../hooks/usePWA"
import { useWebAuthn } from "../hooks/useWebAuthn"
import { usePreferences, Theme, Density } from "../providers/PreferencesProvider"
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
  GripVertical
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const { isInstallable, installApp } = usePWA()
  const { isSupported, isPlatformAuthenticatorAvailable, registerCredential } = useWebAuthn()
  
  const { theme, setTheme, density, setDensity, widgets, setWidgets } = usePreferences()

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    security: true
  })

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w))
  }

  const getWidgetName = (id: string) => {
    switch (id) {
      case 'kpi': return 'KPI Overview'
      case 'tasks': return 'Pending Tasks'
      case 'notes': return 'Quick Notes'
      case 'assistant': return 'AI Assistant'
      case 'timeline': return 'Activity Timeline'
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
        </TabsList>

        <TabsContent active={activeTab === "general"}>
          <div className="flex flex-col gap-6">
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-zinc-300">Name</label>
                  <Input defaultValue="Admin User" className="bg-zinc-950 border-zinc-800 focus:border-blue-600 transition-colors" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-zinc-300">Email</label>
                  <Input defaultValue="admin@adaptiveai.com" type="email" className="bg-zinc-950 border-zinc-800 focus:border-blue-600 transition-colors" />
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-800 px-6 py-4">
                <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">Save Changes</Button>
              </CardFooter>
            </Card>

            {isInstallable && (
              <Card className="border-blue-900/30 bg-blue-900/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-blue-500" />
                    Install Desktop App
                  </CardTitle>
                  <CardDescription>
                    Install AdaptiveAI Business Suite to your device for a faster, native-like experience.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={installApp} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Install Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent active={activeTab === "appearance"}>
          <div className="flex flex-col gap-6">
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-zinc-400" />
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
                        theme === t ? 'border-blue-600 bg-blue-600/10' : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900'
                      }`}
                    >
                      <div className={`h-12 w-full rounded ${t === 'light' ? 'bg-zinc-200' : t === 'dark' ? 'bg-zinc-800' : 'bg-gradient-to-r from-zinc-200 to-zinc-800'}`} />
                      <span className="text-sm font-medium capitalize text-zinc-300">{t}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-zinc-400" />
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
                      className={`capitalize transition-colors ${density === d ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'}`}
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
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-zinc-400" />
                Dashboard Layout
              </CardTitle>
              <CardDescription>Toggle which modules appear on your dashboard. Reordering can be done directly on the dashboard page.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...widgets].sort((a, b) => a.order - b.order).map(w => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-md border border-zinc-800 bg-zinc-950">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-zinc-600" />
                      <span className="text-sm font-medium text-zinc-200">{getWidgetName(w.id)}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleWidget(w.id)}
                      className={w.visible ? "text-blue-500" : "text-zinc-500"}
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
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-zinc-400" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Control how you receive updates and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-zinc-100">Email Notifications</h4>
                  <p className="text-sm text-zinc-400">Receive reports and summaries via email.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  className="h-5 w-5 rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-600 accent-blue-600 transition-colors"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-zinc-100">Push Notifications</h4>
                  <p className="text-sm text-zinc-400">Get instant alerts on your desktop or mobile.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  className="h-5 w-5 rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-600 accent-blue-600 transition-colors"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-zinc-100">Security Alerts</h4>
                  <p className="text-sm text-zinc-400">Important notices about your account security.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.security}
                  onChange={(e) => setNotifications({...notifications, security: e.target.checked})}
                  className="h-5 w-5 rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-600 accent-blue-600 transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-zinc-800 px-6 py-4 text-xs text-zinc-500">
              Changes are saved automatically.
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent active={activeTab === "security"}>
          <div className="flex flex-col gap-6">
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-blue-500" />
                  Biometric Authentication
                </CardTitle>
                <CardDescription>
                  Use your device's fingerprint or face recognition to sign in securely.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isSupported ? (
                  <div className="rounded-md bg-zinc-950 p-4 text-sm text-zinc-400 border border-zinc-800">
                    WebAuthn is not supported by your current browser or device.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition-colors hover:border-zinc-700">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-zinc-100">Passkeys & Biometrics</p>
                          <p className="text-xs text-zinc-500">
                            {isPlatformAuthenticatorAvailable 
                              ? "Platform authenticator detected." 
                              : "No platform authenticator detected, but security keys are supported."}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={registerCredential} className="border-zinc-700 hover:bg-zinc-800">
                        Setup
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-zinc-400" />
                  Trusted Devices
                </CardTitle>
                <CardDescription>Manage the devices where you are logged in.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition-colors hover:border-zinc-700">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="font-medium text-zinc-100">MacBook Pro - Chrome</p>
                      <p className="text-xs text-zinc-500">Current session • San Francisco, CA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-500 font-medium bg-green-500/10 px-2 py-1 rounded">
                    <Check className="h-3 w-3" />
                    Active
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-800 px-6 py-4">
                <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors">
                  Sign out from all other devices
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Ensure your account is using a long, random password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-zinc-300">Current Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-zinc-950 border-zinc-800 focus:border-blue-600 transition-colors" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-zinc-300">New Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-zinc-950 border-zinc-800 focus:border-blue-600 transition-colors" />
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-800 px-6 py-4">
                <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">Update Password</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
