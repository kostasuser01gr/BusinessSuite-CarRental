import { useState, useMemo } from "react"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"
import { Drawer } from "../components/ui/Drawer"
import { Skeleton } from "../components/ui/Skeleton"
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
  Trash2,
  AlertCircle
} from "lucide-react"
import { Customer } from "../../../shared/types"
import { useCustomers } from "../hooks/useCustomers"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { customerSchema, CustomerInput } from "../../../shared/schemas"
import { cn } from "../utils/cn"
import { animatePulse } from "../animations"

export default function CustomersPage() {
  const { customers, isLoading, createCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('view')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema)
  })

  const filteredCustomers = useMemo(() => customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [customers, searchTerm])

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
    
    if (mode === 'create') {
      reset({ name: '', email: '', phone: '', status: 'active', segment: 'Enterprise' })
    } else if (customer) {
      reset({ 
        name: customer.name, 
        email: customer.email, 
        phone: customer.phone, 
        status: customer.status, 
        segment: customer.segment 
      })
    }
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => {
      setSelectedCustomer(null)
      reset()
    }, 300)
  }

  const onSubmit = (data: CustomerInput) => {
    if (drawerMode === 'create') {
      createCustomer(data)
    } else if (drawerMode === 'edit' && selectedCustomer) {
      updateCustomer({ ...selectedCustomer, ...data })
    }
    closeDrawer()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this customer?')) {
      deleteCustomer(id)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Customers"
        description="Manage your client relationships and segments."
        action={
          <Button className="gap-2 shadow-lg shadow-primary/20" onClick={(e) => { animatePulse(e.currentTarget); openDrawer(null, 'create'); }}>
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9 bg-background/50"
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
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 opacity-20" />
                    <p>No customers found matching your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="cursor-pointer group hover:bg-muted/30 transition-colors" onClick={() => openDrawer(customer, 'view')}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{customer.name}</span>
                      <span className="text-xs text-muted-foreground">{customer.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(customer.status)} className="capitalize font-bold text-[10px]">
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm font-medium">
                    {customer.segment}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {new Date(customer.lastContact).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openDrawer(customer, 'edit')}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(customer.id)}>
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
            <div className="flex gap-3 justify-end w-full">
              <Button variant="outline" onClick={closeDrawer} className="flex-1 sm:flex-none">Cancel</Button>
              <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none">{drawerMode === 'create' ? 'Create Customer' : 'Save Changes'}</Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end w-full">
              <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={() => setDrawerMode('edit')}>
                <Edit2 className="h-4 w-4" /> Edit
              </Button>
              <Button className="gap-2 flex-1 sm:flex-none">
                <Mail className="h-4 w-4" /> Contact
              </Button>
            </div>
          )
        }
      >
        <div className="space-y-6">
          <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input 
                {...register('name')}
                disabled={drawerMode === 'view'}
                placeholder="e.g. Acme Corp" 
                className={cn(errors.name && "border-destructive")}
              />
              {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <Input 
                {...register('email')}
                disabled={drawerMode === 'view'}
                placeholder="contact@company.com" 
                className={cn(errors.email && "border-destructive")}
              />
              {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input 
                {...register('phone')}
                disabled={drawerMode === 'view'}
                placeholder="+1 (555) 000-0000" 
                className={cn(errors.phone && "border-destructive")}
              />
              {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select 
                  {...register('status')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={drawerMode === 'view'}
                >
                  <option value="active">Active</option>
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.status && <span className="text-xs text-destructive">{errors.status.message}</span>}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">Segment</label>
                <select 
                  {...register('segment')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={drawerMode === 'view'}
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="SME">SME</option>
                </select>
                {errors.segment && <span className="text-xs text-destructive">{errors.segment.message}</span>}
              </div>
            </div>
          </form>

          {drawerMode === 'view' && selectedCustomer && (
            <div className="pt-6 border-t border-border space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Activity Timeline</h3>
              </div>
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-[7px] before:h-full before:w-[1px] before:bg-border before:content-['']">
                {[
                  { event: 'Invoice Paid', date: '2 days ago', type: 'billing' },
                  { event: 'Booking confirmed', date: '5 days ago', type: 'booking' },
                  { event: 'Customer record created', date: new Date(selectedCustomer.lastContact).toLocaleDateString(), type: 'system' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 pl-6 relative">
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-background border-2 border-primary z-10" />
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.event}</p>
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
