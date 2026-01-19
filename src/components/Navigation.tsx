import { ChevronLeft, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
    const { setTheme, theme } = useTheme()

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
