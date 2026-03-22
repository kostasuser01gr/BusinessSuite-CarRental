import { useState, useMemo } from "react"
import { cn } from "../utils/cn"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"
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
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  Filter,
  DollarSign
} from "lucide-react"
import { Booking, BookingStatus } from "../../../shared/types"
import { useBookings } from "../hooks/useBookings"
import { animatePulse } from "../animations"

export default function BookingsPage() {
  const { bookings, isLoading, createBooking, updateBookingStatus } = useBookings()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')

  const filteredBookings = useMemo(() => bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  }), [bookings, searchTerm, statusFilter])

  const stats = useMemo(() => {
    return {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      revenue: bookings.reduce((acc, b) => acc + (b.status === 'completed' || b.status === 'confirmed' ? parseFloat(b.value.replace('$', '').replace(',', '')) : 0), 0)
    }
  }, [bookings])

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-destructive" />
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-primary" />
    }
  }

  const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'pending': return 'secondary'
      case 'cancelled': return 'destructive'
      case 'completed': return 'default'
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Bookings & Dispatch"
        description="Manage service schedules and resource allocation."
        action={
          <Button className="gap-2 shadow-lg shadow-primary/20" onClick={(e) => animatePulse(e.currentTarget)}>
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="p-3 bg-primary/10 rounded-lg text-primary z-10"><Calendar className="h-6 w-6" /></div>
          <div className="z-10">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Pending Dispatch</p>
            <p className="text-2xl font-black">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 z-10"><CheckCircle2 className="h-6 w-6" /></div>
          <div className="z-10">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Confirmed Today</p>
            <p className="text-2xl font-black">{stats.confirmed}</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-amber-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 z-10"><DollarSign className="h-6 w-6" /></div>
          <div className="z-10">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Pipeline Value</p>
            <p className="text-2xl font-black">${stats.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customer or ID..."
            className="pl-9 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex p-1 bg-muted rounded-lg border border-border overflow-hidden">
            {(['all', 'pending', 'confirmed', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-bold uppercase transition-all rounded-md",
                  statusFilter === status ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[150px]">Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-8 w-8 opacity-20" />
                    <p>No bookings found for the selected criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{booking.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                        {booking.customerName.charAt(0)}
                      </div>
                      <span className="font-semibold text-sm">{booking.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold bg-muted/50 border-border">
                      {booking.serviceType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        booking.status === 'confirmed' ? "text-emerald-500" : 
                        booking.status === 'pending' ? "text-amber-500" : 
                        booking.status === 'cancelled' ? "text-destructive" : "text-primary"
                      )}>
                        {booking.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground">{booking.value}</TableCell>
                  <TableCell>
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="flex flex-col gap-1.5 z-10 text-center md:text-left">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2 justify-center md:justify-start">
            <CheckCircle2 className="h-5 w-5" /> Smart Dispatch Active
          </h3>
          <p className="text-xs text-muted-foreground max-w-md">
            Your resources are currently optimized for maximum utilization. 12 assets are in field and 4 are ready for deployment.
          </p>
        </div>
        <Button variant="outline" className="z-10 bg-background hover:bg-muted gap-2 border-primary/20 text-primary font-bold text-xs uppercase tracking-wider">
          Open Dispatch View <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
