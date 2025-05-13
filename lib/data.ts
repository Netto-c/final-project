import type { Partner, Location } from "./types"

// Données initiales pour les partenaires
export const initialPartners: Partner[] = [
  {
    id: "1",
    name: "AMN",
    networkCapacity: 4,
  },
  {
    id: "2",
    name: "NURAN",
    networkCapacity: 2,
  },
  {
    id: "3",
    name: "RURALSTAR",
    networkCapacity: 8,
  }
]

// Données initiales pour les localités
export const initialLocations: Location[] = []
// export const initialLocations: Location[] = [
//   {
//     id: "1",
//     name: "Abidjan Centre",
//     averageTrafficPerSubscriber: 0.08,
//     totalSubscribers: 25000,
//     blockingProbability: 2,
//   },
//   {
//     id: "2",
//     name: "Bouaké",
//     averageTrafficPerSubscriber: 0.06,
//     totalSubscribers: 15000,
//     blockingProbability: 5,
//   },
//   {
//     id: "3",
//     name: "Yamoussoukro",
//     averageTrafficPerSubscriber: 0.05,
//     totalSubscribers: 10000,
//     blockingProbability: 3,
//   },
//   {
//     id: "4",
//     name: "San Pedro",
//     averageTrafficPerSubscriber: 0.07,
//     totalSubscribers: 8000,
//     blockingProbability: 4,
//   },
//   {
//     id: "5",
//     name: "Korhogo",
//     averageTrafficPerSubscriber: 0.04,
//     totalSubscribers: 5000,
//     blockingProbability: 7,
//   }
// ]
