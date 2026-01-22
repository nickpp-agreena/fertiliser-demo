export function AgreenaMapPanel() {
  // For now, show a placeholder. Later we can add a real map or screenshot
  return (
    <div className="w-[720px] min-h-screen bg-green-100 flex items-center justify-center flex-shrink-0 border-l border-[#E3E3E3]">
      <div className="text-center">
        <div className="text-4xl font-bold text-green-700 mb-2">Map</div>
        <div className="text-sm text-green-600">720px × Full Height</div>
      </div>
    </div>
  )
}
