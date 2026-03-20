export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-zinc-400">Manage your account and application preferences</p>
      </header>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white">Profile Information</h3>
          <p className="text-sm text-zinc-400 mt-1">Update your personal details</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300">Name</label>
              <input 
                type="text" 
                className="mt-1 block w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <input 
                type="email" 
                className="mt-1 block w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-white">Security</h3>
          <p className="text-sm text-zinc-400 mt-1">Manage your password and security settings</p>
          <div className="mt-4">
            <button className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
