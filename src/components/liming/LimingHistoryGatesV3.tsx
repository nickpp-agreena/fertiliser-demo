import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react"
import { CircleExclamationIcon } from "@/components/icons/CircleExclamationIcon"
import type { LimingHistoryV3 } from "@/lib/limingTypes"

interface LimingHistoryGatesV3Props {
  history: LimingHistoryV3
  onHistoryChange: (history: LimingHistoryV3) => void
  hideDot?: boolean
}

// Generate years from 2025 down to 2005 (20 years)
const getAvailableYears = (): string[] => {
  const years: string[] = []
  for (let i = 2025; i >= 2005; i--) {
    years.push(String(i))
  }
  return years
}

export function LimingHistoryGatesV3({ history, onHistoryChange, hideDot = false }: LimingHistoryGatesV3Props) {
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
      <Card className="mb-8 border border-[#E5E5E5] shadow-sm bg-white rounded-[12px]">
        <CardHeader className="pt-8 pb-5">
          <CardTitle className="text-[20px] leading-[130%] font-semibold text-[#0D0D0D]">
            Build your liming history
          </CardTitle>
          <div className="mt-2">
            <p className="text-[14px] leading-[150%] text-[#666666]">
              Add the liming applications you've made over time.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-px w-full bg-[#E5E5E5] mb-6" />
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
                <SelectTrigger className="w-full h-10 text-base border-[#333333] focus:border-primary">
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
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-row items-center py-4 px-4 gap-4 rounded-[8px]" style={{ background: '#FFFBEB', border: '1px solid #FEF3C7' }}>
                <div className="flex items-center justify-center w-5 h-5 flex-shrink-0" style={{ color: '#92400E' }}>
                  <CircleExclamationIcon className="w-5 h-5" />
                </div>
                <p className="text-[14px] leading-[150%] font-normal" style={{ color: '#92400E' }}>
                  You can go back up to 20 years, but it's fine to start with what you remember. The more accurate this is, the better we can estimate soil impact and carbon outcomes.
                </p>
              </div>
            </div>
          )}

          {history.appliedLast20Years === false && (
            <div className="pt-5 border-t-2 animate-in fade-in duration-300">
              <div className="flex flex-row items-center py-2 px-4 gap-4 rounded-[4px]" style={{ background: '#FFF9E0' }}>
                <div className="flex items-center justify-center w-4 h-4 flex-shrink-0" style={{ color: '#662C09' }}>
                  <CircleExclamationIcon className="w-4 h-4" />
                </div>
                <p className="text-[12px] leading-[150%] font-medium" style={{ color: '#662C09', fontFamily: 'Overpass' }}>
                  No liming plans required for your farm
                </p>
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
