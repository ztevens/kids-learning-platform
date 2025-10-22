"use client"

import { Button } from "@/components/ui/button"
import { FancyLogo } from "@/components/ui/fancy-logo"
import Link from "next/link"
import { Home, BookOpen, Users, Settings, ArrowLeft } from "lucide-react"

interface MainNavProps {
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
  showHomeButton?: boolean
  children?: React.ReactNode
}

export function MainNav({ 
  showBackButton = false, 
  backHref = "/", 
  backLabel = "Back",
  showHomeButton = true,
  children 
}: MainNavProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={backHref} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {backLabel}
                </Link>
              </Button>
            )}
            <FancyLogo size="md" clickable={true} />
          </div>

          <div className="flex items-center gap-4">
            {showHomeButton && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </Button>
            )}
            {children}
          </div>
        </div>
      </div>
    </header>
  )
}