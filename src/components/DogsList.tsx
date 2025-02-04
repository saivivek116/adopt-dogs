import { Heart } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button';
import { Card } from './ui/card';

const DogsList = ({ dogs, handleFavDogs, favDogs }) => {

  const modDogsList = dogs.map((dog) => ({ ...dog, isFav: favDogs.includes(dog.id) }));

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 container p-4'>
      {modDogsList.map(({ id, name, img, age, zip_code, breed, isFav }) => (
        <Card key={id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <Image src={img} alt={name} width={200}
            height={200}
            className="w-full h-auto object-cover"
          />

          <div className="p-4 space-y-2">
            <h2 className="text-xl font-semibold">Name: {name}</h2>
            <p className="text-gray-500">{age} years old</p>
            <p className="text-gray-500 text-sm">Breed: {breed}</p>
            <p className="text-gray-500 text-sm">Zip Code: {zip_code}</p>
            <Button className='rounded bg-blue-500 text-white px-4 py-2 hover:bg-blue-800 flex justify-center gap-2' onClick={() => handleFavDogs(id)}> {isFav ? "Remove from " : "Add to "}Favorite </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default DogsList