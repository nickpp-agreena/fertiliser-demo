import { ChevronLeft, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/components/theme-provider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

interface NavigationProps {
    fieldCount: number
    onFieldCountChange: (count: number) => void
}

export function Navigation({ fieldCount, onFieldCountChange }: NavigationProps) {
    const { setTheme, theme } = useTheme()
    const [fieldCountInput, setFieldCountInput] = useState<string>(fieldCount.toString())

    const handleFieldCountBlur = () => {
        const num = parseInt(fieldCountInput, 10)
        if (!isNaN(num) && num >= 1 && num <= 50) {
            onFieldCountChange(num)
        } else {
            setFieldCountInput(fieldCount.toString())
        }
    }

    const handleFieldCountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleFieldCountBlur()
        }
    }

    // Sync input value when fieldCount changes externally
    useEffect(() => {
        setFieldCountInput(fieldCount.toString())
    }, [fieldCount])

    return (
        <nav className="border-b bg-background px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Crops</span>
                    <span>&gt;</span>
                    <span className="font-medium text-primary">Alfalfa</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor="field-count" className="text-sm text-muted-foreground whitespace-nowrap">
                        Fields:
                    </Label>
                    <Input
                        id="field-count"
                        type="number"
                        min="1"
                        max="50"
                        value={fieldCountInput}
                        onChange={(e) => setFieldCountInput(e.target.value)}
                        onBlur={handleFieldCountBlur}
                        onKeyDown={handleFieldCountKeyDown}
                        className="w-16 h-9 text-center"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("shadcn")}>
                            ShadCN Theme {theme === 'shadcn' && '✓'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("agreena")}>
                            Agreena Theme {theme === 'agreena' && '✓'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline">Save and exit</Button>
            </div>
        </nav>
    )
}
