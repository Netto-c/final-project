import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Ce middleware est désactivé pour le moment car nous utilisons localStorage/sessionStorage
// pour la gestion de l'authentification côté client
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: [],
}
