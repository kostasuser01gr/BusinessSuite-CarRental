import { useState, useMemo } from "react"
import { cn } from "../utils/cn"
import { SectionHeader } from "../components/ui/SectionHeader"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Skeleton } from "../components/ui/Skeleton"
import { 
  Search, 
  Plus, 
  Book,
  FileText,
  ShieldCheck,
  Zap,
  Star,
  Clock,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  MessageSquare
} from "lucide-react"
import { useOnboarding } from "../providers/OnboardingProvider"
import { animatePulse } from "../animations"

interface SOP {
  id: string
  title: string
  category: string
  lastUpdated: string
  author: string
  isFavorite: boolean
  readTime: string
  complianceLevel: 'critical' | 'standard' | 'internal'
}

const MOCK_SOPS: SOP[] = [
  { id: 'SOP-001', title: 'HVAC Unit Calibration Protocol', category: 'Maintenance', lastUpdated: '2026-03-15', author: 'Engineering Team', isFavorite: true, readTime: '8 min', complianceLevel: 'critical' },
  { id: 'SOP-002', title: 'Customer Onboarding Workflow', category: 'Operations', lastUpdated: '2026-02-28', author: 'Ops Lead', isFavorite: false, readTime: '5 min', complianceLevel: 'standard' },
  { id: 'SOP-003', title: 'Drone Pre-Flight Safety Check', category: 'Fleet', lastUpdated: '2026-03-10', author: 'Flight Safety', isFavorite: true, readTime: '12 min', complianceLevel: 'critical' },
  { id: 'SOP-004', title: 'Data Privacy & GDPR Guide', category: 'Security', lastUpdated: '2026-01-20', author: 'Legal Dept', isFavorite: false, readTime: '15 min', complianceLevel: 'internal' },
  { id: 'SOP-005', title: 'Warehouse Inventory Audit', category: 'Logistics', lastUpdated: '2026-03-01', author: 'Warehouse Mgr', isFavorite: false, readTime: '10 min', complianceLevel: 'standard' },
]

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  
  const categories = ["All", "Maintenance", "Operations", "Fleet", "Security", "Logistics"]

  const filteredSOPs = useMemo(() => MOCK_SOPS.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(searchTerm.toLowerCase()) || sop.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'All' || sop.category === activeCategory
    return matchesSearch && matchesCategory
  }), [searchTerm, activeCategory])

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <SectionHeader
        title="Knowledge & SOPs"
        description="Access organizational standards and operating procedures."
        action={
          <Button className="gap-2 shadow-lg shadow-primary/20" onClick={(e) => animatePulse(e.currentTarget)}>
            <Plus className="h-4 w-4" /> New Article
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      activeCategory === cat 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Zap className="h-4 w-4 fill-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">AI RAG Active</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AdaptiveAI has indexed 42 manual PDFs. You can ask the assistant for specific technical steps directly.
              </p>
              <Button size="sm" variant="outline" className="w-full h-8 text-[10px] font-bold border-primary/20 bg-background hover:bg-primary/10">
                Configure Retrieval
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by keyword, SOP ID, or compliance level..."
              className="pl-10 h-11 bg-background/50 border-border focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredSOPs.map((sop) => (
              <Card key={sop.id} className="group hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden border-border bg-card">
                <div className={cn(
                  "h-1.5 w-full",
                  sop.complianceLevel === 'critical' ? 'bg-destructive' : sop.complianceLevel === 'standard' ? 'bg-primary' : 'bg-muted'
                )} />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter bg-muted/50">
                      {sop.category}
                    </Badge>
                    <div className="flex gap-1">
                      {sop.isFavorite && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-1">{sop.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase mb-4">{sop.id}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{sop.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className={cn("h-3 w-3", sop.complianceLevel === 'critical' ? 'text-destructive' : 'text-emerald-500')} />
                        <span className="capitalize">{sop.complianceLevel}</span>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="h-5 w-5 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">JD</div>
                      <div className="h-5 w-5 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">AI</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSOPs.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-2xl border border-dashed border-border">
              <Book className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="font-bold text-foreground">No procedures found</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-1">Try adjusting your search or category filter to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
