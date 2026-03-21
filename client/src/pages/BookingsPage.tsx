import { useState } from "react"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"
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
  MoreVertical
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

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Bookings"
        description="Schedule and track service appointments."
        action={
          <Button className="gap-2">
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
                <TableRow key={booking.id}>
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
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
