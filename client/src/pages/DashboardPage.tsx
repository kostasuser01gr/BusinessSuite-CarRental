export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400">Welcome to your business overview</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-zinc-200">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-white">$45,231.89</p>
          <p className="mt-1 text-sm text-green-500">+20.1% from last month</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-zinc-200">Active Subscriptions</h3>
          <p className="mt-2 text-3xl font-bold text-white">+2350</p>
          <p className="mt-1 text-sm text-green-500">+180.1% from last month</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-zinc-200">Active Now</h3>
          <p className="mt-2 text-3xl font-bold text-white">+573</p>
          <p className="mt-1 text-sm text-blue-500">+201 since last hour</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="text-lg font-semibold text-zinc-200 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-zinc-800" />
                <div>
                  <p className="text-sm font-medium text-white">Project {i} updated</p>
                  <p className="text-xs text-zinc-500">2 hours ago</p>
                </div>
              </div>
              <span className="text-xs font-medium text-zinc-400">Status: Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
