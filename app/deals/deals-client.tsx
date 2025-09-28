"use client"

import type React from "react"

import { useState } from "react"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Deal = {
  id: string
  name: string
  contacts: { name: string }
  stage: "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"
  value: number
  probability: number
  owner: string
  ownerAvatar: string
  expectedClose: string
  description: string
  created_at: string
}

const getStageColor = (stage: Deal["stage"]) => {
  const colors = {
    Lead: "bg-gray-100 text-gray-800",
    Qualified: "bg-blue-100 text-blue-800",
    Proposal: "bg-yellow-100 text-yellow-800",
    Negotiation: "bg-orange-100 text-orange-800",
    "Closed Won": "bg-green-100 text-green-800",
    "Closed Lost": "bg-red-100 text-red-800",
  }
  return colors[stage]
}

export default function DealsClient({ initialDeals }: { initialDeals: Deal[] }) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contacts.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = stageFilter === "all" || deal.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const handleAddDeal = async (dealData: Partial<Deal>) => {
    const { data, error } = await supabase.from('deals').insert([dealData]).select('*, contacts (*)')
    if (error) {
      console.error(error)
      alert(error.message)
    } else if (data) {
      setDeals([...deals, data[0] as Deal])
      setIsDialogOpen(false)
      router.refresh()
    }
  }

  const handleEditDeal = async (dealData: Partial<Deal>) => {
    if (editingDeal) {
      const { data, error } = await supabase.from('deals').update(dealData).eq('id', editingDeal.id).select('*, contacts (*)')
      if (error) {
        console.error(error)
        alert(error.message)
      } else if (data) {
        setDeals(
          deals.map((deal) => (deal.id === editingDeal.id ? (data[0] as Deal) : deal))
        )
        setEditingDeal(null)
        setIsDialogOpen(false)
        router.refresh()
      }
    }
  }

  const handleDeleteDeal = async (dealId: string) => {
    const { error } = await supabase.from('deals').delete().eq('id', dealId)
    if (error) {
      console.error(error)
      alert(error.message)
    } else {
      setDeals(deals.filter((deal) => deal.id !== dealId))
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
            <p className="text-muted-foreground">Manage your sales pipeline and opportunities</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingDeal(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Deal
              </Button>
            </DialogTrigger>
            <DealDialog
              deal={editingDeal}
              onSave={editingDeal ? handleEditDeal : handleAddDeal}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingDeal(null)
              }}
            />
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search deals..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Closed Won">Closed Won</SelectItem>
              <SelectItem value="Closed Lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDeals.map((deal) => (
                <Card key={deal.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{deal.name}</CardTitle>
                        <CardDescription>{deal.contacts.name}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingDeal(deal)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Deal
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDeal(deal.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Deal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                      <span className="text-sm text-muted-foreground">{deal.probability}%</span>
                    </div>
                    <div className="text-2xl font-bold">${deal.value.toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={deal.ownerAvatar || "/placeholder.svg"} className="object-cover" />
                        <AvatarFallback className="text-xs">
                          {deal.owner
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{deal.owner}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expected close: {new Date(deal.expectedClose).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredDeals.map((deal) => (
                    <div key={deal.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="space-y-1">
                            <h3 className="font-medium">{deal.name}</h3>
                            <p className="text-sm text-muted-foreground">{deal.contacts.name}</p>
                          </div>
                          <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                          <div className="text-lg font-semibold">${deal.value.toLocaleString()}</div>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={deal.ownerAvatar || "/placeholder.svg"} className="object-cover" />
                              <AvatarFallback className="text-xs">
                                {deal.owner
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{deal.owner}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(deal.expectedClose).toLocaleDateString()}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingDeal(deal)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Deal
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDeal(deal.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Deal
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DealDialog({
  deal,
  onSave,
  onCancel,
}: {
  deal: Deal | null
  onSave: (data: Partial<Deal>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: deal?.name || "",
    contact_id: deal?.contacts.name || "",
    stage: deal?.stage || "Lead",
    value: deal?.value || 0,
    probability: deal?.probability || 0,
    expectedClose: deal?.expectedClose || "",
    description: deal?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{deal ? "Edit Deal" : "Add New Deal"}</DialogTitle>
        <DialogDescription>
          {deal ? "Update the deal information below." : "Create a new deal opportunity."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dealName">Deal Name</Label>
          <Input
            id="dealName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            value={formData.contact_id}
            onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => setFormData({ ...formData, stage: value as Deal["stage"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Closed Won">Closed Won</SelectItem>
                <SelectItem value="Closed Lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="probability">Probability (%)</Label>
            <Input
              id="probability"
              type="number"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value">Value ($)</Label>
            <Input
              id="value"
              type="number"
              min="0"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedClose">Expected Close</Label>
            <Input
              id="expectedClose"
              type="date"
              value={formData.expectedClose}
              onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{deal ? "Update Deal" : "Create Deal"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
