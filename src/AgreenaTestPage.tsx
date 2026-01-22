import { useState } from "react"
import { AgreenaLayout } from "./components/agreena/AgreenaLayout"
import { AgreenaMapPanel } from "./components/agreena/AgreenaMapPanel"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { Info } from "lucide-react"
import { TrashIcon } from "./components/icons/TrashIcon"
import { ChevronDownIcon } from "./components/icons/ChevronDownIcon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion"
import { Chip } from "./components/ui/chip"
import { FieldIcon } from "./components/icons/FieldIcon"
import { RulerTriangleIcon } from "./components/icons/RulerTriangleIcon"
import { SegmentedControl } from "./components/ui/segmented-control"
import { FarmIcon } from "./components/icons/FarmIcon"
import { SeedlingIcon } from "./components/icons/SeedlingIcon"
import { Checkbox } from "./components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "./components/ui/select"

export function AgreenaTestPage() {
  // Generate years for Liming demo (2025 down to 2005)
  const limingYears = Array.from({ length: 21 }, (_, i) => {
    const year = 2025 - i
    return { value: String(year), label: String(year) }
  })

  const [textOnlyValue, setTextOnlyValue] = useState("first")
  const [iconTextValue, setIconTextValue] = useState("first")
  const [iconOnlyValue, setIconOnlyValue] = useState("farm")
  const [selectValue, setSelectValue] = useState<string>("")
  const [checkboxStates, setCheckboxStates] = useState({
    unchecked: false,
    indeterminate: "indeterminate" as const,
    checked: true,
    dangerUnchecked: false,
    dangerIndeterminate: "indeterminate" as const,
    dangerChecked: true,
    disabledUnchecked: false,
    disabledIndeterminate: "indeterminate" as const,
    disabledChecked: true,
  })

  const handleBack = () => {
    window.location.href = "/"
  }

  const handleSave = () => {
    console.log("Save clicked")
  }

  return (
    <AgreenaLayout
      title="Harvest year 2024"
      onBack={handleBack}
      rightAction="Save and exit"
      onRightAction={handleSave}
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

          {/* Liming Plan Row */}
          <div className="px-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="liming-plan-1" className="bg-[#F2F2F2] rounded-[8px] border border-[#CCCCCC]">
                <AccordionTrigger className="hover:no-underline px-4 py-3">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h3 className="text-[16px] leading-[150%] font-bold text-[#0D0D0D]">
                        Spring Liming 2024
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Chip type="info" size="big" label="Limestone" />
                        <Chip type="neutral" size="small" label="2024" />
                        <Chip
                          type="neutral"
                          size="small"
                          label="2.5 t/ha"
                          icon={<RulerTriangleIcon size={12} />}
                        />
                        <Chip
                          type="success"
                          size="small"
                          label="3 fields"
                          icon={<FieldIcon size={12} />}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="text-[14px] text-[#666666]">
                    Plan details would appear here when expanded.
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Checkbox Examples */}
          <div className="px-6 space-y-6">
            <div className="space-y-4">
              <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                Checkbox examples
              </Label>
              
              {/* Default variant - unchecked, indeterminate, checked */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checkboxStates.unchecked}
                    onCheckedChange={(checked) =>
                      setCheckboxStates((prev) => ({ ...prev, unchecked: checked as boolean }))
                    }
                  />
                  <Label className="text-[14px] leading-[150%] font-normal text-[#0D0D0D] cursor-pointer">
                    Label
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checkboxStates.indeterminate}
                    onCheckedChange={(checked) =>
                      setCheckboxStates((prev) => ({ ...prev, indeterminate: checked as typeof prev.indeterminate }))
                    }
                  />
                  <Label className="text-[14px] leading-[150%] font-normal text-[#0D0D0D] cursor-pointer">
                    Label
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={checkboxStates.checked}
                    onCheckedChange={(checked) =>
                      setCheckboxStates((prev) => ({ ...prev, checked: checked as boolean }))
                    }
                  />
                  <Label className="text-[14px] leading-[150%] font-normal text-[#0D0D0D] cursor-pointer">
                    Label
                  </Label>
                </div>
              </div>

              {/* Danger variant - unchecked, indeterminate, checked */}
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    variant="danger"
                    checked={checkboxStates.dangerUnchecked}
                    onCheckedChange={(checked) =>
                      setCheckboxStates((prev) => ({ ...prev, dangerUnchecked: checked as boolean }))
                    }
                  />
                  <Label className="text-[14px] leading-[150%] font-normal text-[#0D0D0D] cursor-pointer">
                    Label
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    variant="danger"
                    checked={checkboxStates.dangerIndeterminate}
                    onCheckedChange={(checked) =>
                      setCheckboxStates((prev) => ({ ...prev, dangerIndeterminate: checked as typeof prev.dangerIndeterminate }))
                    }
                  />
                  <Label className="text-[14px] leading-[150%] font-normal text-[#0D0D0D] cursor-pointer">
                    Label
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    variant="danger"
                    checked={checkboxStates.dangerChecked}
                    onCheckedChange={(checked) =>
                      setCheckboxStates((prev) => ({ ...prev, dangerChecked: checked as boolean }))
                    }
                  />
                  <Label className="text-[14px] leading-[150%] font-normal text-[#0D0D0D] cursor-pointer">
                    Label
                  </Label>
                </div>
              </div>

              {/* Disabled variant - unchecked, indeterminate, checked */}
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center gap-3">
                  <Checkbox checked={checkboxStates.disabledUnchecked} disabled />
                  <Label className="text-[14px] leading-[150%] font-normal text-[#4D4D4D] cursor-not-allowed">
                    Label
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox checked={checkboxStates.disabledIndeterminate} disabled />
                  <Label className="text-[14px] leading-[150%] font-normal text-[#4D4D4D] cursor-not-allowed">
                    Label
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox checked={checkboxStates.disabledChecked} disabled />
                  <Label className="text-[14px] leading-[150%] font-normal text-[#4D4D4D] cursor-not-allowed">
                    Label
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Segmented Control Examples */}
          <div className="px-6 space-y-6">
            {/* Example 1: Text-only */}
            <div className="space-y-2">
              <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                Text-only segmented control
              </Label>
              <SegmentedControl
                options={[
                  { value: "first", label: "First" },
                  { value: "second", label: "Second" },
                  { value: "third", label: "Third" },
                ]}
                value={textOnlyValue}
                onValueChange={setTextOnlyValue}
              />
            </div>

            {/* Example 2: Text-only disabled */}
            <div className="space-y-2">
              <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                Text-only disabled state
              </Label>
              <SegmentedControl
                options={[
                  { value: "first", label: "First" },
                  { value: "second", label: "Second" },
                  { value: "third", label: "Third" },
                ]}
                value="first"
                onValueChange={() => {}}
                disabled
              />
            </div>

            {/* Example 3: Icon + Text */}
            <div className="space-y-2">
              <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                Icon + text segmented control
              </Label>
              <SegmentedControl
                options={[
                  {
                    value: "first",
                    label: "First",
                    icon: <FarmIcon size={16} />,
                  },
                  {
                    value: "second",
                    label: "Second",
                    icon: <SeedlingIcon size={16} />,
                  },
                  {
                    value: "third",
                    label: "Third",
                    icon: <Info className="w-4 h-4" />,
                    disabled: true,
                  },
                ]}
                value={iconTextValue}
                onValueChange={setIconTextValue}
              />
            </div>

            {/* Example 4: Icon-only */}
            <div className="space-y-2">
              <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                Icon-only segmented control
              </Label>
              <SegmentedControl
                options={[
                  {
                    value: "farm",
                    label: "",
                    icon: <FarmIcon size={16} />,
                  },
                  {
                    value: "seedling",
                    label: "",
                    icon: <SeedlingIcon size={16} />,
                  },
                ]}
                value={iconOnlyValue}
                onValueChange={setIconOnlyValue}
              />
            </div>
          </div>

          {/* Select Dropdown with Liming Demo Content */}
          <div className="px-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[14px] leading-[150%] text-[#333333] font-normal">
                Harvest Year (from Liming Demo)
              </Label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Recent Years</SelectLabel>
                    {limingYears.slice(0, 5).map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Mid Range</SelectLabel>
                    {limingYears.slice(5, 15).map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Historical Years</SelectLabel>
                    {limingYears.slice(15).map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main CTA Button */}
          <div className="px-6 pt-4">
            <Button className="w-full h-[48px] bg-[#4730DB] hover:bg-[#6D57FF] active:bg-[#849FE5] text-white text-[16px] leading-[150%] font-medium rounded-[8px] transition-colors">
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
