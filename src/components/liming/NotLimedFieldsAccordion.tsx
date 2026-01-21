import { useState, useEffect } from "react"
import type { Field } from "@/lib/limingTypes"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MarkNotLimedDialog } from "./MarkNotLimedDialog"
import { XCircle, Plus, MapPin, Pencil } from "lucide-react"

interface NotLimedFieldsAccordionProps {
  fields: Field[]
  notLimedFieldIds: Set<string>
  assignedFieldIds: Set<string>
  onMarkNotLimed: (fieldIds: string[]) => void
  onUnmarkNotLimed: (fieldIds: string[]) => void
  isOpen?: boolean
  onClose?: () => void
}

export function NotLimedFieldsAccordion({
  fields,
  notLimedFieldIds,
  assignedFieldIds,
  onMarkNotLimed,
  onUnmarkNotLimed,
  isOpen,
  onClose,
}: NotLimedFieldsAccordionProps) {
  const [showDialog, setShowDialog] = useState(false)

  const notLimedFields = fields.filter(f => notLimedFieldIds.has(f.id))
  const totalArea = notLimedFields.reduce((sum, field) => sum + (field.hectares || 0), 0)

  return (
    <>
      <AccordionItem value="not-limed-fields" id="not-limed-fields-accordion" className="relative">
        <AccordionTrigger className="hover:no-underline pr-12 py-5">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full ring-2 bg-muted-foreground/40 border-muted-foreground/40" />
              <span className="font-bold text-lg tracking-tight text-foreground">Fields Without Liming</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 gap-1">
                <MapPin className="h-3 w-3" />
                {notLimedFields.length} field{notLimedFields.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 mr-4">
            {notLimedFields.length > 0 && (
              <span className="text-xs font-semibold text-muted-foreground">
                {totalArea.toFixed(1)} ha
              </span>
            )}
          </div>
        </AccordionTrigger>

        <AccordionContent className="pt-6">
          <div className="space-y-6">
            {notLimedFields.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gradient-to-br from-card/50 to-card/30">
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-foreground font-semibold">No fields marked as not limed</p>
                    <p className="text-muted-foreground text-sm">Mark fields that won't receive liming treatment</p>
                  </div>
                  <Button 
                    onClick={() => setShowDialog(true)} 
                    variant="outline" 
                    className="w-full border-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Mark Fields as Not Limed
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Not Limed Fields</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notLimedFields.length} field{notLimedFields.length !== 1 ? 's' : ''} marked as not receiving liming treatment
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowDialog(true)} 
                      variant="outline" 
                      size="sm"
                      className="border-2"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Fields
                    </Button>
                  </div>

                  {/* Fields List */}
                  <div className="rounded-lg border bg-background p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {notLimedFields.map((field) => (
                        <div
                          key={field.id}
                          className="relative flex flex-col justify-between p-4 rounded-lg border-2 border-muted-foreground/30 bg-muted/20 h-28"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-sm block truncate text-foreground">{field.name}</span>
                              {field.hectares && (
                                <span className="text-xs text-muted-foreground font-medium mt-0.5 inline-block">{field.hectares.toFixed(1)} ha</span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                              <XCircle className="h-2.5 w-2.5 mr-1" />
                              Not Limed
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 py-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Total Area:</span>
                    <span className="text-sm font-semibold text-foreground">{totalArea.toFixed(1)} ha</span>
                  </div>
                </div>

              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <MarkNotLimedDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={onMarkNotLimed}
        onUnmark={onUnmarkNotLimed}
        fields={fields}
        notLimedFieldIds={notLimedFieldIds}
        assignedFieldIds={assignedFieldIds}
      />
    </>
  )
}
