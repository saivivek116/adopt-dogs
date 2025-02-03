// components/DogCard.tsx
"use client"

import React from 'react'
import { Dog } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DogCardProps {
  dog: Dog
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
}

export default function DogCard({ dog, isFavorited, onToggleFavorite }: DogCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{dog.name}</CardTitle>
        <CardDescription>{dog.breed}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={dog.img} alt={dog.name} className="mb-2 rounded-md" />
        <p className="text-sm">Age: {dog.age}</p>
        <p className="text-sm">Zip: {dog.zip_code}</p>
        <Button
          variant={isFavorited ? 'secondary' : 'default'}
          className="mt-2"
          onClick={() => onToggleFavorite(dog.id)}
        >
          {isFavorited ? 'Unfavorite' : 'Favorite'}
        </Button>
      </CardContent>
    </Card>
  )
}
