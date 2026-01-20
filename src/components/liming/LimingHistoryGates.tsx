import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Liming History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question 1: Applied in last 5 years? */}
        {history.appliedLast5Years === null && (
          <div className="space-y-4">
            <Label className="text-base font-semibold">Applied liming in the last 5 years?</Label>
            <div className="flex gap-3">
              <Button
                onClick={() => handleAppliedLast5Years(true)}
                variant="outline"
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                onClick={() => handleAppliedLast5Years(false)}
                variant="outline"
                className="flex-1"
              >
                No
              </Button>
            </div>
          </div>
        )}

        {/* Question 2: Applied before last 5 years? (only if Q1 was No) */}
        {history.appliedLast5Years === false && history.appliedBefore5Years === null && (
          <div className="space-y-4">
            <Label className="text-base font-semibold">Was liming applied before the last 5 years?</Label>
            <div className="flex gap-3">
              <Button
                onClick={() => handleAppliedBefore5Years(true)}
                variant="outline"
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                onClick={() => handleAppliedBefore5Years(false)}
                variant="outline"
                className="flex-1"
              >
                No
              </Button>
            </div>
          </div>
        )}

        {/* Question 3: When was it last applied? (only if Q2 was Yes) */}
        {history.appliedBefore5Years === true && history.lastAppliedYearBand === null && (
          <div className="space-y-4">
            <Label className="text-base font-semibold">When was it last applied?</Label>
            <Select onValueChange={(value) => handleLastAppliedYear(value as any)}>
              <SelectTrigger className="w-full">
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
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {history.appliedLast5Years === true && "Proceed to create year-specific liming plans."}
              {history.appliedLast5Years === false && history.appliedBefore5Years === false && "No liming plans required."}
              {history.appliedLast5Years === false && history.appliedBefore5Years === true && history.lastAppliedYearBand !== null && 
                "Proceed to create historical liming plan."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
