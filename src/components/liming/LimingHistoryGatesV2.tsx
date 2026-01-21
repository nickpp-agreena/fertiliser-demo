import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react"
import type { LimingHistoryV2 } from "@/lib/limingTypes"

interface LimingHistoryGatesV2Props {
  history: LimingHistoryV2
  onHistoryChange: (history: LimingHistoryV2) => void
}

// Generate years from 2025 down to 2005 (20 years)
const getAvailableYears = (): string[] => {
  const years: string[] = []
  for (let i = 2025; i >= 2005; i--) {
    years.push(String(i))
  }
  return years
}

export function LimingHistoryGatesV2({ history, onHistoryChange }: LimingHistoryGatesV2Props) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const availableYears = getAvailableYears()

  const handleAppliedLast20Years = (value: boolean) => {
    if (value) {
      // Yes - proceed to year selection
      onHistoryChange({
        appliedLast20Years: true,
        lastAppliedYear: null
      })
    } else {
      // No - show confirmation dialog
      setShowConfirmDialog(true)
    }
  }

  const handleConfirmNo = () => {
    onHistoryChange({
      appliedLast20Years: false,
      lastAppliedYear: null
    })
    setShowConfirmDialog(false)
  }

  const handleGoBack = () => {
    setShowConfirmDialog(false)
    // Reset to null so user can reanswer
    onHistoryChange({
      appliedLast20Years: null,
      lastAppliedYear: null
    })
  }

  const handleLastAppliedYear = (year: string) => {
    onHistoryChange({
      ...history,
      lastAppliedYear: year
    })
  }

  return (
    <>
      <Card className="mb-8 border-2 shadow-md bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-5">
          <CardTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
            <div className="h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-primary/30" />
            Liming History
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Tell us about your liming history to get started</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question 1: Applied in last 20 years? */}
          {history.appliedLast20Years === null && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-base font-bold text-foreground block">Applied liming in the last 20 years?</Label>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAppliedLast20Years(true)}
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md transition-all"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleAppliedLast20Years(false)}
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md transition-all"
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {/* Question 2: In which year did you last apply liming? (only if Q1 was Yes) */}
          {history.appliedLast20Years === true && history.lastAppliedYear === null && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-base font-bold text-foreground block">In which year did you last apply liming to your fields?</Label>
              <Select onValueChange={handleLastAppliedYear}>
                <SelectTrigger className="w-full h-12 text-base border-2 focus:border-primary">
                  <SelectValue placeholder="Select year..." />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Summary when complete */}
          {(history.appliedLast20Years === true && history.lastAppliedYear !== null) && (
            <div className="pt-5 border-t-2 animate-in fade-in duration-300">
              <div className="flex items-start gap-4 p-5 rounded-lg border-2 border-primary/30 shadow-sm" style={{ backgroundColor: 'rgba(109, 87, 255, 0.05)' }}>
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground mb-1.5">
                    You can create a historical plan for your liming cycle applied over the last 20 years, the more accurate you can be the better our calculations
                  </p>
                </div>
              </div>
            </div>
          )}

          {history.appliedLast20Years === false && (
            <div className="pt-5 border-t-2 animate-in fade-in duration-300">
              <div className="flex items-start gap-4 p-5 rounded-lg border-2 border-primary/30 shadow-sm" style={{ backgroundColor: 'rgba(109, 87, 255, 0.05)' }}>
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground mb-1.5">
                    No liming plans required for your farm
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog for "No" answer */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Confirm No Liming Applied
            </DialogTitle>
            <DialogDescription>
              You have confirmed that no liming has been applied in the last 20 years. Is this correct?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleGoBack}>
              Go Back
            </Button>
            <Button onClick={handleConfirmNo}>
              Yes, Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
