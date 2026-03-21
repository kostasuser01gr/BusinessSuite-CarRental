import { useState } from "react"
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
  MoreHorizontal, 
  Mail, 
  Phone, 
  Filter,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2
} from "lucide-react"
import { Customer } from "../../../shared/types"

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Acme Corp", email: "contact@acme.com", phone: "+1 (555) 123-4567", status: "active", segment: "Enterprise", lastContact: "2026-03-15" },
  { id: "2", name: "Global Tech", email: "info@globaltech.io", phone: "+1 (555) 987-6543", status: "prospect", segment: "SME", lastContact: "2026-03-20" },
  { id: "3", name: "Stark Industries", email: "pepper@stark.com", phone: "+1 (555) 000-1111", status: "active", segment: "Enterprise", lastContact: "2026-03-18" },
  { id: "4", name: "Wayne Ent", email: "bruce@wayne.com", phone: "+1 (555) 999-8888", status: "inactive", segment: "Enterprise", lastContact: "2025-12-10" },
  { id: "5", name: "Umbrella Corp", email: "hr@umbrella.com", phone: "+1 (555) 666-0000", status: "lead", segment: "Mid-Market", lastContact: "2026-03-21" },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('view')

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusVariant = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'success'
      case 'prospect': return 'secondary'
      case 'lead': return 'outline'
      case 'inactive': return 'destructive'
      default: return 'secondary'
    }
  }

  const openDrawer = (customer: Customer | null, mode: 'create' | 'edit' | 'view') => {
    setSelectedCustomer(customer)
    setDrawerMode(mode)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedCustomer(null)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Customers"
        description="Manage your client relationships and segments."
        action={
          <Button className="gap-2" onClick={() => openDrawer(null, 'create')}>
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="h-4 w-4" /> Sort
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Segment</TableHead>
              <TableHead className="hidden lg:table-cell">Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="cursor-pointer group" onClick={() => openDrawer(customer, 'view')}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{customer.name}</span>
                      <span className="text-xs text-muted-foreground">{customer.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(customer.status)} className="capitalize">
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {customer.segment}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {new Date(customer.lastContact).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openDrawer(customer, 'edit')}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
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
        title={drawerMode === 'create' ? 'Add Customer' : drawerMode === 'edit' ? 'Edit Customer' : 'Customer Details'}
        description={drawerMode === 'view' ? 'Full history and contact information.' : 'Update customer profile data.'}
        footer={
          drawerMode !== 'view' ? (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeDrawer}>Cancel</Button>
              <Button onClick={closeDrawer}>{drawerMode === 'create' ? 'Create Customer' : 'Save Changes'}</Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="gap-2" onClick={() => setDrawerMode('edit')}>
                <Edit2 className="h-4 w-4" /> Edit
              </Button>
              <Button className="gap-2">
                <Mail className="h-4 w-4" /> Contact
              </Button>
            </div>
          )
        }
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                defaultValue={selectedCustomer?.name || ''} 
                disabled={drawerMode === 'view'}
                placeholder="e.g. Acme Corp" 
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                defaultValue={selectedCustomer?.email || ''} 
                disabled={drawerMode === 'view'}
                placeholder="contact@company.com" 
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                defaultValue={selectedCustomer?.phone || ''} 
                disabled={drawerMode === 'view'}
                placeholder="+1 (555) 000-0000" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedCustomer?.status || 'active'}
                  disabled={drawerMode === 'view'}
                >
                  <option value="active">Active</option>
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Segment</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={selectedCustomer?.segment || 'Enterprise'}
                  disabled={drawerMode === 'view'}
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="SME">SME</option>
                  <option value="Mid-Market">Mid-Market</option>
                </select>
              </div>
            </div>
          </div>

          {drawerMode === 'view' && (
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {[
                  { event: 'Email sent', date: '2 days ago' },
                  { event: 'Booking confirmed', date: '5 days ago' },
                  { event: 'Customer record created', date: '1 month ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="font-medium">{item.event}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
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
