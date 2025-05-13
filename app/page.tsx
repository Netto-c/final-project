"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Network, Radio, Users, MapPin, Plus, LogOut } from "lucide-react"
import PartnersList from "@/components/partners-list"
import LocationsList from "@/components/locations-list"
import PredictionDashboard from "@/components/prediction-dashboard"
import AuthGuard from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import type { Partner, Location } from "@/lib/types"
import { initialPartners, initialLocations } from "@/lib/data"

export default function Home() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const { user, logout } = useAuth()

  useEffect(() => {
    // Initialiser avec des données de test
    setPartners(initialPartners)
    setLocations(initialLocations)
  }, [])

  const addPartner = (partner: Partner) => {
    setPartners([...partners, { ...partner, id: Date.now().toString() }])
  }

  const addLocation = (location: Location) => {
    setLocations([...locations, { ...location, id: Date.now().toString() }])
  }

  const deletePartner = (id: string) => {
    setPartners(partners.filter((partner) => partner.id !== id))
  }

  const deleteLocation = (id: string) => {
    setLocations(locations.filter((location) => location.id !== id))
  }

  // Ajouter les fonctions de modification
  const updatePartner = (id: string, updatedPartner: Partial<Partner>) => {
    setPartners(partners.map((partner) => (partner.id === id ? { ...partner, ...updatedPartner } : partner)))
  }

  const updateLocation = (id: string, updatedLocation: Partial<Location>) => {
    setLocations(locations.map((location) => (location.id === id ? { ...location, ...updatedLocation } : location)))
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Network className="h-8 w-8 text-orange-500 mr-2" />
              <h1 className="text-2xl font-bold">TelecomPredict</h1>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center">
                  <div className="mr-4 text-right">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.company || "Aucune entreprise"}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Radio className="h-4 w-4" />
                <span>Prédictions</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Partenaires</span>
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Localités</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Card>
                <CardHeader>
                  <CardTitle>Tableau de Bord des Prédictions</CardTitle>
                  <CardDescription>
                    Trouvez le meilleur partenaire pour chaque localité en fonction des besoins en capacité réseau
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PredictionDashboard partners={partners} locations={locations} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partners">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion des Partenaires</CardTitle>
                    <CardDescription>Ajoutez, modifiez ou supprimez des partenaires réseau</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <PartnersList
                    partners={partners}
                    onAddPartner={addPartner}
                    onDeletePartner={deletePartner}
                    onUpdatePartner={updatePartner}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion des Localités</CardTitle>
                    <CardDescription>Ajoutez, modifiez ou supprimez des localités</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <LocationsList
                    locations={locations}
                    onAddLocation={addLocation}
                    onDeleteLocation={deleteLocation}
                    onUpdateLocation={updateLocation}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AuthGuard>
  )
}
