import { StatTile } from "../components/ui/StatTile"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, CheckCircle2, Clock } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your operations today."
        action={<Button>Download Report</Button>}
      />

      {/* KPI Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatTile
          title="Total Revenue"
          value="$45,231.89"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          trendValue="+20.1%"
        />
        <StatTile
          title="Active Subscriptions"
          value="+2350"
          icon={<Users className="h-4 w-4" />}
          trend="up"
          trendValue="+180.1%"
        />
        <StatTile
          title="Conversion Rate"
          value="4.5%"
          icon={<Activity className="h-4 w-4" />}
          trend="neutral"
          trendValue="0.0%"
        />
        <StatTile
          title="Churn Rate"
          value="1.2%"
          icon={<ArrowDownRight className="h-4 w-4" />}
          trend="down"
          trendValue="-0.5%"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Operations Summary */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Operations Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-zinc-900 rounded-md border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
              [Chart Placeholder: Revenue vs Expenses]
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2 hours ago", text: "New enterprise subscription created", user: "Alice M." },
                { time: "4 hours ago", text: "Q3 Marketing budget approved", user: "Bob T." },
                { time: "5 hours ago", text: "Server scaling event triggered", user: "System" },
                { time: "Yesterday", text: "Onboarding flow updated", user: "Charlie D." },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-zinc-200">{activity.text}</p>
                    <p className="text-xs text-zinc-500">{activity.time} · {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Tasks Block */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Pending Tasks</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {[
                { title: "Review Q4 roadmap", status: "High Priority", done: false },
                { title: "Approve new hires", status: "Medium", done: false },
                { title: "Update privacy policy", status: "Done", done: true },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3">
                  {task.done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-zinc-500" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.done ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
                      {task.title}
                    </p>
                  </div>
                  <Badge variant={task.done ? "success" : task.status === "High Priority" ? "destructive" : "secondary"}>
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes Block */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Quick Notes</CardTitle>
            <Button variant="ghost" size="sm">Add Note</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                <h4 className="text-sm font-medium text-zinc-200">Weekly Sync Sync</h4>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  Discussed the new scaling requirements for the primary database. Need to follow up with devops team by Thursday.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                <h4 className="text-sm font-medium text-zinc-200">Client Feedback</h4>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  Enterprise clients are requesting more granular role-based access control. Scheduled a product discovery call.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
