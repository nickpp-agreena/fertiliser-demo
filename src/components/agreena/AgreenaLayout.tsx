import { ReactNode } from "react"
import { AgreenaSidebar } from "./AgreenaSidebar"
import { AgreenaTopNav } from "./AgreenaTopNav"

interface AgreenaLayoutProps {
  children: ReactNode
  title?: string
  onBack?: () => void
  onSave?: () => void
}

export function AgreenaLayout({ children, title = "Page Title", onBack, onSave }: AgreenaLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] overflow-x-auto">
      <div className="w-[1440px] min-h-screen mx-auto bg-[#FAFAFA] flex">
        <AgreenaSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AgreenaTopNav title={title} onBack={onBack} onSave={onSave} />
          <div className="flex flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
