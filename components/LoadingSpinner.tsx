'use client'

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
}
