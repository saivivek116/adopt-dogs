// src/app/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { MultiSelect } from "@/components/multi-select";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";

function CustomMultiSelect({ handleChange, id }) {
  const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    async function fetchBreeds() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dogs/breeds`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('An error occurred while fetching breeds');
        }
        const breeds = await response.json();
        setBreeds(breeds.map((breed: string) => ({ value: breed, label: breed })));
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchBreeds();
  }, []);
  return (
    <div className="max-w-xl">
      <MultiSelect
        options={breeds}
        onValueChange={(selected) => {
          handleChange(selected);
        }
        }
        defaultValue={[]}
        placeholder="Select Breed"
        variant="inverted"
        id={id}
      />
    </div>
  );
}

export default CustomMultiSelect;