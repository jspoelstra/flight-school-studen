import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Certificate, Clock, CheckCircle } from '@phosphor-icons/react'
import { EndorsementForm } from './endorsement-form'
import { EndorsementList } from './endorsement-list'
import { useKV } from '@github/spark/hooks'
import { useSampleData } from '@/lib/sample-data'
import { Endorsement } from '@/lib/types'

export function EndorsementsManager() {
  const [activeTab, setActiveTab] = useState('list')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEndorsement, setEditingEndorsement] = useState<Endorsement | null>(null)
  
  const [endorsements, setEndorsements] = useKV<Endorsement[]>('endorsements', [])
  const { students } = useSampleData()

  // Calculate metrics
  const activeEndorsements = endorsements.filter(e => e.status === 'active')
  const expiredEndorsements = endorsements.filter(e => e.status === 'expired')
  const recentEndorsements = endorsements.filter(e => {
    const issuedDate = new Date(e.issuedAt)
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return issuedDate >= monthAgo
  })

  const handleCreateEndorsement = (endorsementData: Omit<Endorsement, 'id' | 'issuedAt' | 'hash'>) => {
    const newEndorsement: Endorsement = {
      ...endorsementData,
      id: `end-${Date.now()}`,
      issuedAt: new Date().toISOString(),
      hash: generateHash(endorsementData.content)
    }
    
    setEndorsements(current => [...current, newEndorsement])
    setShowCreateForm(false)
  }

  const handleEditEndorsement = (endorsement: Endorsement) => {
    setEditingEndorsement(endorsement)
    setShowCreateForm(true)
  }

  const handleUpdateEndorsement = (endorsementData: Omit<Endorsement, 'id' | 'issuedAt' | 'hash'>) => {
    if (!editingEndorsement) return
    
    const updatedEndorsement: Endorsement = {
      ...endorsementData,
      id: editingEndorsement.id,
      issuedAt: editingEndorsement.issuedAt,
      hash: generateHash(endorsementData.content)
    }
    
    setEndorsements(current => 
      current.map(e => e.id === editingEndorsement.id ? updatedEndorsement : e)
    )
    setShowCreateForm(false)
    setEditingEndorsement(null)
  }

  const handleCancelForm = () => {
    setShowCreateForm(false)
    setEditingEndorsement(null)
  }

  // Simple hash function for demo purposes
  const generateHash = (content: string): string => {
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">
              {editingEndorsement ? 'Edit Endorsement' : 'Create New Endorsement'}
            </h3>
            <p className="text-muted-foreground">
              {editingEndorsement ? 'Update endorsement details' : 'Issue a new endorsement to a student'}
            </p>
          </div>
          <Button variant="outline" onClick={handleCancelForm}>
            Cancel
          </Button>
        </div>
        
        <EndorsementForm
          students={students}
          endorsement={editingEndorsement}
          onSubmit={editingEndorsement ? handleUpdateEndorsement : handleCreateEndorsement}
          onCancel={handleCancelForm}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Endorsements Management</h3>
          <p className="text-muted-foreground">Manage student endorsements and certifications</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Endorsement
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Endorsements</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEndorsements.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently valid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Issues</CardTitle>
            <Certificate className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentEndorsements.length}</div>
            <p className="text-xs text-muted-foreground">
              Issued this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredEndorsements.length}</div>
            <p className="text-xs text-muted-foreground">
              Need renewal
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Endorsements</TabsTrigger>
          <TabsTrigger value="active">Active Only</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <EndorsementList 
            endorsements={endorsements}
            students={students}
            onEdit={handleEditEndorsement}
          />
        </TabsContent>

        <TabsContent value="active">
          <EndorsementList 
            endorsements={activeEndorsements}
            students={students}
            onEdit={handleEditEndorsement}
          />
        </TabsContent>

        <TabsContent value="expired">
          <EndorsementList 
            endorsements={expiredEndorsements}
            students={students}
            onEdit={handleEditEndorsement}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}