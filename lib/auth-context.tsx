"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Types pour l'utilisateur
export interface User {
  id: string
  name: string
  email: string
  company?: string
  role: "admin" | "user"
}

// Types pour le contexte d'authentification
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: () => boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  register: (email: string, password: string, name: string, company?: string) => Promise<boolean>
  logout: () => void
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Données utilisateur simulées
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin Test",
    email: "admin@example.com",
    password: "password123",
    company: "TelecomPredict",
    role: "admin" as const,
  },
  {
    id: "2",
    name: "User Test",
    email: "user@example.com",
    password: "password123",
    company: "Client Company",
    role: "user" as const,
  },
  {
    id: "3",
    name: "User Test",
    email: "olongocynthia@gmail.com",
    password: "password123",
    company: "Client Company",
    role: "user" as const,
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("telecom_user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error)
          localStorage.removeItem("telecom_user")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Modifier la fonction login pour ajouter la redirection et corriger la gestion de l'authentification

  // Fonction de connexion
  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    // Simulation d'une API d'authentification
    //const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)
    const foundUser = MOCK_USERS.find((u) => u.email === email)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)

      if (rememberMe) {
        localStorage.setItem("telecom_user", JSON.stringify(userWithoutPassword))
      } else {
        sessionStorage.setItem("telecom_user", JSON.stringify(userWithoutPassword))
      }

      // Redirection vers la page d'accueil après connexion réussie
      router.push("/")
      return true
    }

    return false
  }


  const isAuthenticated = (): boolean => 
  {
    //get local storage telecom_user and return true if not empty or null
    const storedUser = localStorage.getItem("telecom_user")
    const sessionUser = sessionStorage.getItem("telecom_user")
    return !!(storedUser || sessionUser)
  }

  // Fonction d'inscription
  const register = async (email: string, password: string, name: string, company?: string): Promise<boolean> => {
    // Vérifier si l'email existe déjà
    const userExists = MOCK_USERS.some((u) => u.email === email)

    if (userExists) {
      return false
    }

    // Dans une application réelle, vous enregistreriez l'utilisateur dans votre base de données
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      name,
      email,
      company,
      role: "user" as const,
    }

    setUser(newUser)
    localStorage.setItem("telecom_user", JSON.stringify(newUser))

    return true
  }

  // Fonction de déconnexion
  const logout = () => {
    setUser(null)
    localStorage.removeItem("telecom_user")
    sessionStorage.removeItem("telecom_user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }

  return context
}
