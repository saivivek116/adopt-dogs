"use client";

import React, { useEffect, useState } from "react";
import { MultiSelect } from "@/components/multi-select";
import { useRouter } from 'next/navigation'

function CustomMultiSelect({ handleChange, id }) {
  const [breeds, setBreeds] = useState([]);
  const router = useRouter();
  useEffect(() => {
    async function fetchBreeds() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dogs/breeds`, {
          credentials: 'include'
        });
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          throw new Error('An error occurred while fetching breeds');
        }
        const breeds = await response.json();
        setBreeds(breeds.map((breed: string) => ({ value: breed, label: breed })));
      } catch (err) {
        if (err.message === "Unauthorized") {
          router.push("/login");
        } else {
          console.log(err.message);
        }
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