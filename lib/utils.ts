import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calcule la capacité nécessaire (en TRX) pour une localité
 * Formule: C = ((A*P) - log(B)√(A*P)) / 8
 *
 * @param averageTraffic - Trafic moyen par abonné (Erlang)
 * @param population - Nombre total d'abonnés
 * @param blockingProbability - Probabilité de blocage (%)
 * @returns Capacité nécessaire en TRX
 */
export function calculateCapacityNeeded(
  averageTraffic: number,
  population: number,
  blockingProbability: number,
): number {
  // Convertir la probabilité de pourcentage à décimal
  const blockingProbDecimal = blockingProbability / 100

  // Calculer le produit A*P
  const trafficProduct = averageTraffic * population

  // Calculer la capacité selon la formule
  const capacity = (trafficProduct - (Math.log(blockingProbDecimal) * Math.sqrt(trafficProduct))) / 8

  // Retourner la capacité arrondie au nombre entier supérieur
  return Math.max(0, capacity)
}
