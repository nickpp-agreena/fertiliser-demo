import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Circle } from "lucide-react"
import type { LimingHistory } from "@/lib/limingTypes"

interface LimingHistoryGatesProps {
  history: LimingHistory
  onHistoryChange: (history: LimingHistory) => void
}

export function LimingHistoryGates({ history, onHistoryChange }: LimingHistoryGatesProps) {
  const handleAppliedLast5Years = (value: boolean) => {
    if (value) {
      // Yes - proceed to plan builder with year-specific plans
      onHistoryChange({
        appliedLast5Years: true,
        appliedBefore5Years: null,
        lastAppliedYearBand: null
      })
    } else {
      // No - ask about before 5 years
      onHistoryChange({
        appliedLast5Years: false,
        appliedBefore5Years: null,
        lastAppliedYearBand: null
      })
    }
  }

  const handleAppliedBefore5Years = (value: boolean) => {
    if (value) {
      // Yes - ask when it was last applied
      onHistoryChange({
        ...history,
        appliedBefore5Years: true,
        lastAppliedYearBand: null
      })
    } else {
      // No - no plans required
      onHistoryChange({
        ...history,
        appliedBefore5Years: false,
        lastAppliedYearBand: null
      })
    }
  }

  const handleLastAppliedYear = (band: "5-7-years-ago" | "8-10-years-ago" | "more-than-10-years-ago") => {
    onHistoryChange({
      ...history,
      lastAppliedYearBand: band
    })
  }

  return (
    <Card className="mb-8 border-2 shadow-md bg-gradient-to-br from-card to-card/95">
      <CardHeader className="pb-5">
        <CardTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
          <div className="h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-primary/30" />
          Liming History
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2 font-medium">Tell us about your liming history to get started</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question 1: Applied in last 5 years? */}
        {history.appliedLast5Years === null && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-base font-bold text-foreground block">Applied liming in the last 5 years?</Label>
            <div className="flex gap-3">
              <Button
                onClick={() => handleAppliedLast5Years(true)}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md transition-all"
              >
                Yes
              </Button>
              <Button
                onClick={() => handleAppliedLast5Years(false)}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md transition-all"
              >
                No
              </Button>
            </div>
          </div>
        )}

        {/* Question 2: Applied before last 5 years? (only if Q1 was No) */}
        {history.appliedLast5Years === false && history.appliedBefore5Years === null && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-base font-bold text-foreground block">Was liming applied before the last 5 years?</Label>
            <div className="flex gap-3">
              <Button
                onClick={() => handleAppliedBefore5Years(true)}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md transition-all"
              >
                Yes
              </Button>
              <Button
                onClick={() => handleAppliedBefore5Years(false)}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md transition-all"
              >
                No
              </Button>
            </div>
          </div>
        )}

        {/* Question 3: When was it last applied? (only if Q2 was Yes) */}
        {history.appliedBefore5Years === true && history.lastAppliedYearBand === null && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-base font-bold text-foreground block">When was it last applied?</Label>
            <Select onValueChange={(value) => handleLastAppliedYear(value as any)}>
              <SelectTrigger className="w-full h-12 text-base border-2 focus:border-primary">
                <SelectValue placeholder="Select time period..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5-7-years-ago">5–7 years ago</SelectItem>
                <SelectItem value="8-10-years-ago">8–10 years ago</SelectItem>
                <SelectItem value="more-than-10-years-ago">More than 10 years ago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Summary when complete */}
        {(history.appliedLast5Years === true || 
          (history.appliedLast5Years === false && history.appliedBefore5Years === false) ||
          (history.appliedLast5Years === false && history.appliedBefore5Years === true && history.lastAppliedYearBand !== null)) && (
          <div className="pt-5 border-t-2 animate-in fade-in duration-300">
            <div className="flex items-start gap-4 p-5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground mb-1.5">
                  {history.appliedLast5Years === true && "Ready to create year-specific liming plans"}
                  {history.appliedLast5Years === false && history.appliedBefore5Years === false && "No liming plans required for your farm"}
                  {history.appliedLast5Years === false && history.appliedBefore5Years === true && history.lastAppliedYearBand !== null && 
                    "Ready to create historical liming plan"}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {history.appliedLast5Years === true && "You can now create plans for years 2021-2025"}
                  {history.appliedLast5Years === false && history.appliedBefore5Years === true && history.lastAppliedYearBand !== null && 
                    "You can create a historical plan for liming applied more than 5 years ago"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
