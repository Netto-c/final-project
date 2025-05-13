"use client"

import { useState } from "react"
import type { Partner } from "@/lib/types"
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

interface PartnersListProps {
  partners: Partner[]
  onAddPartner: (partner: Partner) => void
  onDeletePartner: (id: string) => void
  onUpdatePartner: (id: string, partner: Partial<Partner>) => void
}

export default function PartnersList({ partners, onAddPartner, onDeletePartner, onUpdatePartner }: PartnersListProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [error, setError] = useState("")

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [editName, setEditName] = useState("")
  const [editCapacity, setEditCapacity] = useState("")

  const handleSubmit = () => {
    if (!name || !capacity) {
      setError("Veuillez remplir tous les champs")
      return
    }

    const capacityNum = Number.parseInt(capacity)
    if (isNaN(capacityNum) || capacityNum <= 0) {
      setError("La capacité doit être un nombre positif")
      return
    }

    onAddPartner({
      id: Date.now().toString(),
      name,
      networkCapacity: capacityNum,
    })

    setName("")
    setCapacity("")
    setError("")
    setOpen(false)
  }

  const openDetails = (partner: Partner) => {
    setSelectedPartner(partner)
    setDetailsOpen(true)
  }

  const openEdit = (partner: Partner) => {
    setSelectedPartner(partner)
    setEditName(partner.name)
    setEditCapacity(partner.networkCapacity.toString())
    setEditOpen(true)
  }

  const handleEditSubmit = () => {
    if (!selectedPartner) return

    if (!editName || !editCapacity) {
      setError("Veuillez remplir tous les champs")
      return
    }

    const capacityNum = Number.parseInt(editCapacity)
    if (isNaN(capacityNum) || capacityNum <= 0) {
      setError("La capacité doit être un nombre positif")
      return
    }

    onUpdatePartner(selectedPartner.id, {
      name: editName,
      networkCapacity: capacityNum,
    })

    setError("")
    setEditOpen(false)
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Partenaire
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un Nouveau Partenaire</DialogTitle>
            <DialogDescription>Entrez les détails du partenaire réseau à ajouter</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacité (TRX)
              </Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
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
            <TableHead>Nom du Partenaire</TableHead>
            <TableHead>Capacité Réseau (TRX)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                Aucun partenaire ajouté
              </TableCell>
            </TableRow>
          ) : (
            partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell>{partner.networkCapacity} TRX</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openDetails(partner)}>
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openEdit(partner)}>
                      <Edit className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeletePartner(partner.id)}>
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
            <DialogTitle>Détails du Partenaire</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">Nom:</div>
                <div>{selectedPartner.name}</div>
                <div className="font-semibold">Capacité Réseau:</div>
                <div>{selectedPartner.networkCapacity} TRX</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modale de modification */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le Partenaire</DialogTitle>
            <DialogDescription>Modifiez les détails du partenaire réseau</DialogDescription>
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
              <Label htmlFor="edit-capacity" className="text-right">
                Capacité (TRX)
              </Label>
              <Input
                id="edit-capacity"
                type="number"
                value={editCapacity}
                onChange={(e) => setEditCapacity(e.target.value)}
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
