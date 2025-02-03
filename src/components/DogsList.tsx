import { Heart } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const DogsList = ({ dogs, handleFavDogs, favDogs }) => {
  return (
    <div className='flex flex-wrap'>
      {dogs.map((dog) => (
        <div key={dog.id} className="border p-4 m-4 flex flex-col items-center">
          <Image src={dog.img} alt={dog.name} width={200} height={200} />
          <h2 className='text-xl'>{dog.name}</h2>
          <p>{dog.age} years old</p>
          <p className='text-sm'>{dog.breed}</p>
          <p className='text-muted-foreground text-sm'>zipcode: {dog.zip_code}</p>
          <button className='bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-800 flex gap-2' onClick={() => handleFavDogs(dog.id)}>Favorite {favDogs.includes(dog.id) ? <Heart /> : ""}</button>
        </div>
      ))}
    </div>
  )
}

export default DogsList