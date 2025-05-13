"use client"

import { useState } from "react"
import type { Location } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, Eye, Edit } from "lucide-react"

interface LocationsListProps {
  locations: Location[]
  onAddLocation: (location: Location) => void
  onDeleteLocation: (id: string) => void
  onUpdateLocation: (id: string, location: Partial<Location>) => void
}

export default function LocationsList({
  locations,
  onAddLocation,
  onDeleteLocation,
  onUpdateLocation,
}: LocationsListProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [averageTraffic, setAverageTraffic] = useState("")
  const [totalSubscribers, setTotalSubscribers] = useState("")
  const [blockingProbability, setBlockingProbability] = useState("")
  const [error, setError] = useState("")

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [editName, setEditName] = useState("")
  const [editAverageTraffic, setEditAverageTraffic] = useState("")
  const [editTotalSubscribers, setEditTotalSubscribers] = useState("")
  const [editBlockingProbability, setEditBlockingProbability] = useState("")

  const openDetails = (location: Location) => {
    setSelectedLocation(location)
    setDetailsOpen(true)
  }

  const openEdit = (location: Location) => {
    setSelectedLocation(location)
    setEditName(location.name)
    setEditAverageTraffic(location.averageTrafficPerSubscriber.toString())
    setEditTotalSubscribers(location.totalSubscribers.toString())
    setEditBlockingProbability(location.blockingProbability.toString())
    setEditOpen(true)
  }

  const handleEditSubmit = () => {
    if (!selectedLocation) return

    if (!editName || !editAverageTraffic || !editTotalSubscribers || !editBlockingProbability) {
      setError("Veuillez remplir tous les champs")
      return
    }

    const trafficNum = Number.parseFloat(editAverageTraffic)
    const subscribersNum = Number.parseInt(editTotalSubscribers)
    const probabilityNum = Number.parseFloat(editBlockingProbability)

    if (isNaN(trafficNum) || trafficNum <= 0) {
      setError("Le trafic moyen doit être un nombre positif")
      return
    }

    if (isNaN(subscribersNum) || subscribersNum <= 0) {
      setError("Le nombre d'abonnés doit être un nombre entier positif")
      return
    }

    if (isNaN(probabilityNum) || probabilityNum <= 0 || probabilityNum > 100) {
      setError("La probabilité de blocage doit être entre 0 et 100")
      return
    }

    onUpdateLocation(selectedLocation.id, {
      name: editName,
      averageTrafficPerSubscriber: trafficNum,
      totalSubscribers: subscribersNum,
      blockingProbability: probabilityNum,
    })

    setError("")
    setEditOpen(false)
  }

  const handleSubmit = () => {
    if (!name || !averageTraffic || !totalSubscribers || !blockingProbability) {
      setError("Veuillez remplir tous les champs")
      return
    }

    const trafficNum = Number.parseFloat(averageTraffic)
    const subscribersNum = Number.parseInt(totalSubscribers)
    const probabilityNum = Number.parseFloat(blockingProbability)

    if (isNaN(trafficNum) || trafficNum <= 0) {
      setError("Le trafic moyen doit être un nombre positif")
      return
    }

    if (isNaN(subscribersNum) || subscribersNum <= 0) {
      setError("Le nombre d'abonnés doit être un nombre entier positif")
      return
    }

    if (isNaN(probabilityNum) || probabilityNum <= 0 || probabilityNum > 100) {
      setError("La probabilité de blocage doit être entre 0 et 100")
      return
    }

    onAddLocation({
      id: Date.now().toString(),
      name,
      averageTrafficPerSubscriber: trafficNum,
      totalSubscribers: subscribersNum,
      blockingProbability: probabilityNum,
    })

    setName("")
    setAverageTraffic("")
    setTotalSubscribers("")
    setBlockingProbability("")
    setError("")
    setOpen(false)
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une Localité
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une Nouvelle Localité</DialogTitle>
            <DialogDescription>Entrez les détails de la localité à ajouter</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="traffic" className="text-right">
                Trafic Moyen (Erlang)
              </Label>
              <Input
                id="traffic"
                type="number"
                step="0.01"
                value={averageTraffic}
                onChange={(e) => setAverageTraffic(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subscribers" className="text-right">
                Nombre d'Abonnés
              </Label>
              <Input
                id="subscribers"
                type="number"
                value={totalSubscribers}
                onChange={(e) => setTotalSubscribers(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="probability" className="text-right">
                Probabilité de Blocage (%)
              </Label>
              <Input
                id="probability"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={blockingProbability}
                onChange={(e) => setBlockingProbability(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom de la Localité</TableHead>
            <TableHead>Trafic Moyen (Erlang)</TableHead>
            <TableHead>Nombre d'Abonnés</TableHead>
            <TableHead>Probabilité de Blocage (%)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                Aucune localité ajoutée
              </TableCell>
            </TableRow>
          ) : (
            locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.averageTrafficPerSubscriber}</TableCell>
                <TableCell>{location.totalSubscribers}</TableCell>
                <TableCell>{location.blockingProbability}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openDetails(location)}>
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openEdit(location)}>
                      <Edit className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteLocation(location.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modale de détails */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la Localité</DialogTitle>
          </DialogHeader>
          {selectedLocation && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">Nom:</div>
                <div>{selectedLocation.name}</div>
                <div className="font-semibold">Trafic Moyen par Abonné:</div>
                <div>{selectedLocation.averageTrafficPerSubscriber} Erlang</div>
                <div className="font-semibold">Nombre d'Abonnés:</div>
                <div>{selectedLocation.totalSubscribers}</div>
                <div className="font-semibold">Probabilité de Blocage:</div>
                <div>{selectedLocation.blockingProbability}%</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modale de modification */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la Localité</DialogTitle>
            <DialogDescription>Modifiez les détails de la localité</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nom
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-traffic" className="text-right">
                Trafic Moyen (Erlang)
              </Label>
              <Input
                id="edit-traffic"
                type="number"
                step="0.01"
                value={editAverageTraffic}
                onChange={(e) => setEditAverageTraffic(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-subscribers" className="text-right">
                Nombre d'Abonnés
              </Label>
              <Input
                id="edit-subscribers"
                type="number"
                value={editTotalSubscribers}
                onChange={(e) => setEditTotalSubscribers(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-probability" className="text-right">
                Probabilité de Blocage (%)
              </Label>
              <Input
                id="edit-probability"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={editBlockingProbability}
                onChange={(e) => setEditBlockingProbability(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleEditSubmit} className="bg-orange-500 hover:bg-orange-600">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
