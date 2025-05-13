"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network, Radio, Users, MapPin, Lock, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

// Ajouter un AuthGuard avec requireAuth=false pour éviter les redirections en boucle

export default function LoginPage() {
  const router = useRouter()
  const { login, register, isAuthenticated } = useAuth()

  // Rediriger vers la page d'accueil si déjà connecté
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  // États pour le formulaire de connexion
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // États pour le formulaire d'inscription
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerCompany, setRegisterCompany] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [registerLoading, setRegisterLoading] = useState(false)

  // Modifier la fonction handleLogin pour éviter la double redirection

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!email || !password) {
      setLoginError("Veuillez remplir tous les champs")
      return
    }

    try {
      setIsLoading(true)
      // Simulation d'une connexion
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dans un cas réel, vous appelleriez votre API d'authentification ici
      const success = await login(email, password, rememberMe)

      if (!success) {
        setLoginError("Email ou mot de passe incorrect")
      }
      // La redirection est maintenant gérée dans la fonction login
    } catch (error) {
      setLoginError("Une erreur est survenue lors de la connexion")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    if (!registerEmail || !registerPassword || !registerConfirmPassword || !registerName) {
      setRegisterError("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Les mots de passe ne correspondent pas")
      return
    }

    if (registerPassword.length < 8) {
      setRegisterError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    try {
      setRegisterLoading(true)
      // Simulation d'une inscription
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Dans un cas réel, vous appelleriez votre API d'inscription ici
      const success = await register(registerEmail, registerPassword, registerName, registerCompany)

      if (success) {
        router.push("/")
      } else {
        setRegisterError("Cet email est déjà utilisé")
      }
    } catch (error) {
      setRegisterError("Une erreur est survenue lors de l'inscription")
      console.error(error)
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Section de gauche - Informations sur l'application */}
      <div className="bg-orange-500 text-white p-8 md:w-1/2 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Network className="h-10 w-10 mr-3" />
            <h1 className="text-3xl font-bold">TelecomPredict</h1>
          </div>

          <h2 className="text-2xl font-semibold mb-6">Optimisez le déploiement de vos partenaires réseau</h2>

          <p className="mb-8 text-lg">
            Notre plateforme vous aide à prendre des décisions éclairées pour le déploiement de vos infrastructures de
            télécommunication en fonction des besoins réels des localités.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <Radio className="h-6 w-6 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Prédictions Précises</h3>
                <p>Calculez automatiquement les besoins en capacité réseau pour chaque localité</p>
              </div>
            </div>

            <div className="flex items-start">
              <Users className="h-6 w-6 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Gestion des Partenaires</h3>
                <p>Gérez efficacement votre portefeuille de partenaires réseau</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-6 w-6 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Analyse des Localités</h3>
                <p>Suivez les caractéristiques et besoins de chaque zone géographique</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section de droite - Formulaires de connexion/inscription */}
      <div className="bg-white p-8 md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>

            {/* Onglet de connexion */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion</CardTitle>
                  <CardDescription>Connectez-vous à votre compte TelecomPredict</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    {loginError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Link href="/reset-password" className="text-sm text-orange-500 hover:underline">
                          Mot de passe oublié?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Se souvenir de moi
                      </Label>
                    </div>

                    <div className="space-y-4">
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                        {isLoading ? "Connexion en cours..." : "Se connecter"}
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" type="button">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3. কিন্তe.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          Google
                        </Button>
                        <Button variant="outline" type="button">
                          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </form>
              </Card>
            </TabsContent>

            {/* Onglet d'inscription */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Créer un compte</CardTitle>
                  <CardDescription>Inscrivez-vous pour accéder à TelecomPredict</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    {registerError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{registerError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="register-name">
                        Nom complet <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-name"
                        placeholder="Jean Dupont"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-company">Entreprise</Label>
                      <Input
                        id="register-company"
                        placeholder="Nom de votre entreprise (optionnel)"
                        value={registerCompany}
                        onChange={(e) => setRegisterCompany(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">
                        Mot de passe <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">
                        Confirmer le mot de passe <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={registerLoading}
                    >
                      {registerLoading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-500">
                    En vous inscrivant, vous acceptez nos{" "}
                    <Link href="/terms" className="text-orange-500 hover:underline">
                      Conditions d'utilisation
                    </Link>{" "}
                    et notre{" "}
                    <Link href="/privacy" className="text-orange-500 hover:underline">
                      Politique de confidentialité
                    </Link>
                    .
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
