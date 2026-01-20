import type { Plan } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"

interface DeletePlanModalProps {
  plan: Plan
  assignedFieldCount: number
  otherPlans: Plan[] // Plans to reassign to
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  onReassignAndDelete: (targetPlanId: string) => void
}

export function DeletePlanModal({
  plan,
  assignedFieldCount,
  otherPlans,
  isOpen,
  onClose,
  onDelete,
  onReassignAndDelete,
}: DeletePlanModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")

  const handleReassignAndDelete = () => {
    if (selectedPlanId) {
      onReassignAndDelete(selectedPlanId)
      setSelectedPlanId("")
    }
  }

  const handleDelete = () => {
    onDelete()
    setSelectedPlanId("")
  }

  const handleClose = () => {
    setSelectedPlanId("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Plan: {plan.name || "Untitled Plan"}?
          </DialogTitle>
          <DialogDescription>
            {assignedFieldCount > 0 ? (
              <span>
                This plan is assigned to <strong>{assignedFieldCount}</strong> field{assignedFieldCount !== 1 ? 's' : ''}. 
                What would you like to do?
              </span>
            ) : (
              <span>Are you sure you want to delete this plan? This action cannot be undone.</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {assignedFieldCount > 0 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reassign fields to:</label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan..." />
                </SelectTrigger>
                <SelectContent>
                  {otherPlans.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name || "Untitled Plan"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {assignedFieldCount > 0 && (
            <Button
              variant="default"
              onClick={handleReassignAndDelete}
              disabled={!selectedPlanId}
            >
              Reassign & Delete
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            {assignedFieldCount > 0 ? "Delete Anyway" : "Delete Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
