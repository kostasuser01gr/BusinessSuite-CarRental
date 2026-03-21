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
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit2,
  Trash2,
  User as UserIcon,
  CreditCard
} from "lucide-react"
import { Booking } from "../../../shared/types"

const MOCK_BOOKINGS: Booking[] = [
  { id: "BK-1001", customerId: "1", customerName: "Acme Corp", status: "confirmed", date: "2026-03-25", value: "$1,200.00", serviceType: "Fleet Support" },
  { id: "BK-1002", customerId: "3", customerName: "Stark Industries", status: "pending", date: "2026-03-22", value: "$4,500.00", serviceType: "AI Integration" },
  { id: "BK-1003", customerId: "2", customerName: "Global Tech", status: "completed", date: "2026-03-10", value: "$850.00", serviceType: "Consulting" },
  { id: "BK-1004", customerId: "5", customerName: "Umbrella Corp", status: "cancelled", date: "2026-03-15", value: "$2,100.00", serviceType: "Maintenance" },
  { id: "BK-1005", customerId: "1", customerName: "Acme Corp", status: "confirmed", date: "2026-04-01", value: "$1,200.00", serviceType: "Fleet Support" },
]

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [bookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('view')

  const filteredBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-4 w-4 text-primary" />
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-destructive" />
      default: return null
    }
  }

  const getStatusVariant = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'secondary'
      case 'pending': return 'outline'
      case 'completed': return 'success'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const openDrawer = (booking: Booking | null, mode: 'create' | 'edit' | 'view') => {
    setSelectedBooking(booking)
    setDrawerMode(mode)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedBooking(null)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Bookings"
        description="Schedule and track service appointments."
        action={
          <Button className="gap-2" onClick={() => openDrawer(null, 'create')}>
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
          <Calendar className="h-4 w-4" />
          <span>Next 30 days</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Service</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="cursor-pointer group" onClick={() => openDrawer(booking, 'view')}>
                  <TableCell className="font-mono text-xs font-medium text-primary">{booking.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{booking.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <Badge variant={getStatusVariant(booking.status)} className="capitalize">
                        {booking.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {booking.serviceType}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {new Date(booking.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {booking.value}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openDrawer(booking, 'edit')}>
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
        title={drawerMode === 'create' ? 'New Booking' : drawerMode === 'edit' ? 'Edit Booking' : 'Booking Details'}
        description="Appointment information and payment status."
        footer={
          drawerMode !== 'view' ? (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeDrawer}>Cancel</Button>
              <Button onClick={closeDrawer}>{drawerMode === 'create' ? 'Create Booking' : 'Save Changes'}</Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="gap-2" onClick={() => setDrawerMode('edit')}>
                <Edit2 className="h-4 w-4" /> Edit
              </Button>
              <Button className="gap-2" variant="destructive">
                <Trash2 className="h-4 w-4" /> Cancel Booking
              </Button>
            </div>
          )
        }
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Customer</label>
              <div className="relative">
                <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  defaultValue={selectedBooking?.customerName || ''} 
                  disabled={drawerMode === 'view'}
                  placeholder="Select customer..."
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Service Type</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={selectedBooking?.serviceType || 'Fleet Support'}
                disabled={drawerMode === 'view'}
              >
                <option value="Fleet Support">Fleet Support</option>
                <option value="AI Integration">AI Integration</option>
                <option value="Consulting">Consulting</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  defaultValue={selectedBooking?.date || ''} 
                  disabled={drawerMode === 'view'}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Amount</label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    defaultValue={selectedBooking?.value || '$0.00'} 
                    disabled={drawerMode === 'view'}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Status</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={selectedBooking?.status || 'pending'}
                disabled={drawerMode === 'view'}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {drawerMode === 'view' && (
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold mb-4">Payment Summary</h3>
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{selectedBooking?.value}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{selectedBooking?.value}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  )
}
