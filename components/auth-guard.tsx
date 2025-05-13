"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    console.log("auth-guard.tsx: isLoading:", isLoading)
    console.log("auth-guard.tsx: isAuthenticated:", isAuthenticated())
    console.log("auth-guard.tsx: pathname:", pathname)
    console.log("auth-guard.tsx: requireAuth:", requireAuth)
    console.log("auth-guard.tsx: isChecking:", isChecking)
    if (!isLoading) {
      if (requireAuth && !isAuthenticated()) {
        // Ne pas rediriger si on est déjà sur la page de connexion
        if (pathname !== "/login") {
          router.push("/login")
        }
      } else {
        setIsChecking(false)
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, router, pathname])

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
