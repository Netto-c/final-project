export interface Partner {
  id: string
  name: string
  networkCapacity: number // en TRX
}

export interface Location {
  id: string
  name: string
  averageTrafficPerSubscriber: number // en Erlang
  totalSubscribers: number
  blockingProbability: number // en pourcentage
}
