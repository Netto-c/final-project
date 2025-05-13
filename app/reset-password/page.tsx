"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Network, Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Veuillez entrer votre adresse email")
      return
    }

    try {
      setIsLoading(true)
      // Simulation d'une demande de réinitialisation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Dans un cas réel, vous appelleriez votre API ici
      setIsSubmitted(true)
    } catch (error) {
      setError("Une erreur est survenue lors de la demande de réinitialisation")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Network className="h-8 w-8 text-orange-500 mr-2" />
          <h1 className="text-2xl font-bold">TelecomPredict</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Réinitialisation du mot de passe</CardTitle>
            <CardDescription>
              {!isSubmitted
                ? "Entrez votre adresse email pour recevoir un lien de réinitialisation"
                : "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe"}
            </CardDescription>
          </CardHeader>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
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

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                </Button>
              </CardContent>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-center">
                  Un email a été envoyé à <strong>{email}</strong> avec les instructions pour réinitialiser votre mot de
                  passe.
                </p>
              </div>
            </CardContent>
          )}

          <CardFooter className="flex justify-center">
            <Link href="/login" className="flex items-center text-sm text-orange-500 hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour à la page de connexion
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
