import { ReactNode } from "react"
import { AgreenaSidebar } from "./AgreenaSidebar"
import { AgreenaTopNav } from "./AgreenaTopNav"

interface AgreenaLayoutProps {
  children: ReactNode
  title?: string
  titleClickable?: boolean
  titleOptions?: { value: string; label: string }[]
  titleValue?: string
  onTitleChange?: (value: string) => void
  onBack?: () => void
  rightAction?: string
  onRightAction?: () => void
  showTopNav?: boolean
}

export function AgreenaLayout({
  children,
  title = "Page Title",
  titleClickable = false,
  titleOptions,
  titleValue,
  onTitleChange,
  onBack,
  rightAction = "Right Action",
  onRightAction,
  showTopNav = true,
}: AgreenaLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] overflow-x-auto">
      <div className="w-[1440px] min-h-screen mx-auto bg-[#FAFAFA] flex relative">
        <AgreenaSidebar />
        <div className="flex flex-1 min-w-0">
          <div className="flex flex-col flex-1 min-w-0">
            {showTopNav && (
              <AgreenaTopNav
                title={title}
                titleClickable={titleClickable}
                titleOptions={titleOptions}
                titleValue={titleValue}
                onTitleChange={onTitleChange}
                onBack={onBack}
                rightAction={rightAction}
                onRightAction={onRightAction}
              />
            )}
            <div className="flex flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
