"use client"

import Link from "next/link"

interface FancyLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  clickable?: boolean
}

export function FancyLogo({ size = "md", clickable = true }: FancyLogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl", 
    lg: "text-5xl",
    xl: "text-6xl"
  }

  const logoContent = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeClasses[size]} font-black bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-wider drop-shadow-lg`}>
          DOMINUS
        </div>
        <div className="absolute -top-1 -right-1 text-yellow-400 animate-bounce">
          ✨
        </div>
      </div>
      <div className={`${sizeClasses[size]} font-black bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent tracking-wider drop-shadow-lg`}>
        LEARNING
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-blue-500 animate-pulse">🚀</div>
        <div className="text-green-500 animate-bounce">🌟</div>
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