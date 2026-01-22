import { AgreenaLayout } from "./components/agreena/AgreenaLayout"
import { AgreenaMapPanel } from "./components/agreena/AgreenaMapPanel"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { Info } from "lucide-react"
import { TrashIcon } from "./components/icons/TrashIcon"
import { ChevronDownIcon } from "./components/icons/ChevronDownIcon"

export function AgreenaTestPage() {
  const handleBack = () => {
    window.location.href = "/"
  }

  const handleSave = () => {
    console.log("Save clicked")
  }

  // Debug: Log that component is rendering
  console.log("AgreenaTestPage rendering")

  return (
    <AgreenaLayout
      title="Liming Plans"
      onBack={handleBack}
      onSave={handleSave}
    >
      {/* Left Panel - 672px wide */}
      <div className="w-[672px] min-h-screen overflow-y-auto bg-[#FAFAFA]">
        <div className="px-6 py-6 space-y-6">
          {/* Page Heading */}
          <div className="px-6">
            <h1 className="text-[20px] leading-[130%] font-medium text-[#0D0D0D] mb-2">
              Fertiliser practices for this crop:
            </h1>
          </div>

          {/* Form Card */}
          <div className="px-6">
            <div className="bg-white border border-[#CCCCCC] rounded-[8px] p-4 space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] leading-[150%] font-medium text-[#0D0D0D]">
                  Fertiliser 1
                </h3>
                <div className="flex items-center gap-2">
                  <button className="w-6 h-6 rounded-[8px] p-1 hover:bg-gray-100 flex items-center justify-center">
                    <TrashIcon className="w-4 h-4 text-[#8E0000]" />
                  </button>
                  <button className="w-6 h-6 rounded-[8px] p-1 hover:bg-gray-100 flex items-center justify-center">
                    <ChevronDownIcon className="w-4 h-4 text-[#0D0D0D]" />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Fertiliser Type Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                      Select fertiliser type
                    </Label>
                    <Info className="w-4 h-4 text-[#333333]" />
                  </div>
                  <div className="flex border border-[#333333] rounded-[4px] overflow-hidden">
                    <button className="flex-1 h-[40px] px-4 bg-[#4730DB] hover:bg-[#6D57FF] active:bg-[#849FE5] text-white text-[16px] leading-[150%] font-medium border-r border-[#333333] transition-colors">
                      Synthetic
                    </button>
                    <button className="flex-1 h-[40px] px-4 bg-white hover:bg-gray-50 text-[#0D0D0D] text-[16px] leading-[150%] font-medium border-r border-[#333333] transition-colors">
                      Organic
                    </button>
                    <button className="flex-1 h-[40px] px-4 bg-white hover:bg-gray-50 text-[#0D0D0D] text-[16px] leading-[150%] font-medium transition-colors">
                      None
                    </button>
                  </div>
                </div>

                {/* Nitrogen Input */}
                <div className="space-y-2">
                  <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                    Total nitrogen (N) application rate per hectare (ha)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      defaultValue="0"
                      className="h-[40px] px-4 border border-[#B2B2B2] rounded-[4px] text-[14px] leading-[150%] pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] leading-[150%] font-medium text-[#333333]">
                      kg/ha
                    </span>
                  </div>
                </div>

                {/* Nitrification Inhibitor */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                      Was nitrification inhibitor applied?
                    </Label>
                    <Info className="w-4 h-4 text-[#333333]" />
                  </div>
                  <div className="flex border border-[#333333] rounded-[4px] overflow-hidden">
                    <button className="flex-1 h-[40px] px-4 bg-[#4730DB] hover:bg-[#6D57FF] active:bg-[#849FE5] text-white text-[16px] leading-[150%] font-medium border-r border-[#333333] transition-colors">
                      Yes
                    </button>
                    <button className="flex-1 h-[40px] px-4 bg-white hover:bg-gray-50 text-[#0D0D0D] text-[16px] leading-[150%] font-medium transition-colors">
                      No
                    </button>
                  </div>
                </div>

                {/* Phosphorus Input */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                      Was phosphorus applied?
                    </Label>
                    <Info className="w-4 h-4 text-[#333333]" />
                  </div>
                  <div className="flex border border-[#333333] rounded-[4px] overflow-hidden">
                    <button className="flex-1 h-[40px] px-4 bg-[#4730DB] hover:bg-[#6D57FF] active:bg-[#849FE5] text-white text-[16px] leading-[150%] font-medium border-r border-[#333333] transition-colors">
                      Yes
                    </button>
                    <button className="flex-1 h-[40px] px-4 bg-white hover:bg-gray-50 text-[#0D0D0D] text-[16px] leading-[150%] font-medium transition-colors">
                      No
                    </button>
                  </div>
                </div>

                {/* Add Another Link */}
                <div className="pt-2">
                  <button className="flex items-center gap-2 text-[16px] leading-[150%] font-medium text-[#4730DB] underline">
                    <span>+</span>
                    <span>Add another fertiliser application</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main CTA Button */}
          <div className="px-6 pt-4">
            <Button className="w-full h-[48px] bg-[#4730DB] hover:bg-[#6D57FF] active:bg-[#849FE5] text-white text-[16px] leading-[150%] font-medium rounded-[4px] transition-colors">
              Confirm fertiliser practices for 2025
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <AgreenaMapPanel />
    </AgreenaLayout>
  )
}
