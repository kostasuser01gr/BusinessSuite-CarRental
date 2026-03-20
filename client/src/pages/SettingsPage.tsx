import { SectionHeader } from "../components/ui/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { useState } from "react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />
      
      <Tabs>
        <TabsList className="mb-4">
          <TabsTrigger 
            active={activeTab === "general"} 
            onClick={() => setActiveTab("general")}
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")}
          >
            Security
          </TabsTrigger>
          <TabsTrigger 
            active={activeTab === "billing"} 
            onClick={() => setActiveTab("billing")}
          >
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent active={activeTab === "general"}>
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">Name</label>
                <Input defaultValue="Admin User" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">Email</label>
                <Input defaultValue="admin@adaptiveai.com" type="email" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-zinc-800 px-6 py-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent active={activeTab === "security"}>
          <Card>
            <CardHeader>
              <CardTitle>Security Preferences</CardTitle>
              <CardDescription>Manage your password and 2FA.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">Current Password</label>
                <Input type="password" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">New Password</label>
                <Input type="password" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-zinc-800 px-6 py-4">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent active={activeTab === "billing"}>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>You are currently on the Enterprise plan.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-zinc-800 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-zinc-100">Enterprise Plan</h4>
                    <p className="text-sm text-zinc-400">$499 / month</p>
                  </div>
                  <Button variant="outline">Manage Billing</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
