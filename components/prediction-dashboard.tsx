"use client"

import { useMemo } from "react"
import type { Partner, Location } from "@/lib/types"
import { calculateCapacityNeeded } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface PredictionDashboardProps {
  partners: Partner[]
  locations: Location[]
}

export default function PredictionDashboard({ partners, locations }: PredictionDashboardProps) {
  const predictions = useMemo(() => {
    return locations.map((location) => {
      const capacityNeeded = calculateCapacityNeeded(
        location.averageTrafficPerSubscriber,
        location.totalSubscribers,
        location.blockingProbability,
      )

      // Trouver les partenaires compatibles (capacité >= besoin)
      const compatiblePartners = partners
        .filter((partner) => partner.networkCapacity >= capacityNeeded)
        .sort((a, b) => a.networkCapacity - b.networkCapacity) // Trier par capacité croissante

      // Le meilleur partenaire est celui avec la capacité suffisante la plus proche du besoin
      const bestPartner = compatiblePartners.length > 0 ? compatiblePartners[0] : null

      return {
        location,
        capacityNeeded,
        compatiblePartners,
        bestPartner,
      }
    })
  }, [partners, locations])

  // Statistiques globales
  const totalLocations = locations.length
  const locationsWithMatch = predictions.filter((p) => p.bestPartner !== null).length
  const matchPercentage = totalLocations > 0 ? (locationsWithMatch / totalLocations) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Localités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Localités avec Partenaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationsWithMatch}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Taux de Couverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchPercentage.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des prédictions */}
      {locations.length === 0 || partners.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Ajoutez des partenaires et des localités pour voir les prédictions
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Localité</TableHead>
              <TableHead>Capacité Nécessaire (TRX)</TableHead>
              <TableHead>Meilleur Partenaire</TableHead>
              <TableHead>Capacité du Partenaire (TRX)</TableHead>
              <TableHead>Compatibilité</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((prediction) => (
              <TableRow key={prediction.location.id}>
                <TableCell className="font-medium">{prediction.location.name}</TableCell>
                <TableCell>{Math.ceil(prediction.capacityNeeded)} TRX</TableCell>
                <TableCell>
                  {prediction.bestPartner ? (
                    prediction.bestPartner.name
                  ) : (
                    <span className="text-red-500">Aucun partenaire compatible</span>
                  )}
                </TableCell>
                <TableCell>{prediction.bestPartner ? `${prediction.bestPartner.networkCapacity} TRX` : "-"}</TableCell>
                <TableCell>
                  {prediction.bestPartner ? (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Compatible
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <X className="h-3 w-3 mr-1" />
                      Non compatible
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
