"use client"

import Link from "next/link"

interface FancyLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  clickable?: boolean
}

export function FancyLogo({ size = "md", clickable = true }: FancyLogoProps) {
  const sizeClasses = {
    sm: "text-lg sm:text-2xl",
    md: "text-xl sm:text-3xl", 
    lg: "text-2xl sm:text-4xl md:text-5xl",
    xl: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
  }

  const logoContent = (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="relative">
          <div className={`${sizeClasses[size]} font-black bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-wider drop-shadow-lg`}>
            DOMINUS
          </div>
          <div className="absolute -top-1 -right-1 text-yellow-400 animate-bounce text-sm sm:text-base">
            ✨
          </div>
        </div>
        <div className={`${sizeClasses[size]} font-black bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent tracking-wider drop-shadow-lg`}>
          LEARNING
        </div>
      </div>
      <div className="flex gap-2 sm:flex-col sm:gap-1">
        <div className="text-blue-500 animate-pulse text-lg sm:text-xl">🚀</div>
        <div className="text-green-500 animate-bounce text-lg sm:text-xl">🌟</div>
      </div>
    </div>
  )

  if (clickable) {
    return (
      <Link href="/" className="hover:scale-105 transition-transform duration-200">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}