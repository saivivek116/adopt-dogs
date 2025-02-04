'use client';
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import DogsList from "@/components/DogsList";
import { fetchDogs } from "@/lib/fetcher";
import CustomMultiSelect from "@/app/_components/CustomMultiSelect";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SkeletonDogCard from "@/components/SkeletonDogCard";

const defaultSearchParams = { breeds: [], zipCodes: [], ageMin: 0, ageMax: 20, size: 20, from: 0, sort: "breed:asc" }
const DOGS_PER_PAGE = 20;
export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter()
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favDogs, setFavDogs] = useState([]);
  const nextRef = useRef('');
  const [searchParams, setSearchParams] = useState(defaultSearchParams);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setModalOpen] = useState(false);
  const [idealDog, setIdealDog] = useState(null);
  const [idealDogLoading, setIdealDogLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return;
    }
    fetchIds(searchParams);
  }, [isAuthenticated, searchParams]);


  const handleBreedChange = (selected) => {
    setCurrentPage(1);
    setSearchParams((prev) => ({
      ...prev,
      breeds: selected,
      from: 0,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams((prev) => ({
      ...prev,
      from: (page - 1) * DOGS_PER_PAGE,
    }));
  };

  const handleMatchDogs = async () => {
    try {
      setIdealDogLoading(true);
      setModalOpen(true);
      // Call the matching API. We assume it accepts the favDogs list in the body.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dogs/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(favDogs),
      });
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch ideal dog");
      }
      const { match } = await response.json();
      const dogs = await fetchDogs([match]);
      setIdealDog(dogs[0]);
    } catch (error) {
      if (error.message === "Unauthorized") {
        // Use next/navigation's router to redirect to login.
        router.push("/login");
      } else {
        console.error(error);
      }
    } finally {
      setIdealDogLoading(false);
    }
  };


  const fetchIds = async (params) => {
    try {
      setLoading(true);
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dogs/search`);
      if (params) {
        if (params.breeds) {
          params.breeds.forEach(breed => url.searchParams.append("breeds", breed));
        }
        if (params.zipCodes) {
          params.zipCodes.forEach(zip => url.searchParams.append("zipCodes", zip));
        }
        url.searchParams.append("ageMin", params.ageMin);
        url.searchParams.append("ageMax", params.ageMax);
        url.searchParams.append("size", params.size);
        url.searchParams.append("from", params.from);
        url.searchParams.append("sort", params.sort);
      }
      const response = await fetch(url, {
        credentials: 'include'
      });
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      if (!response.ok) {
        throw new Error('An error occurred while fetching dog Ids');
      }

      const { next, resultIds, total, prev = "" } = await response.json();
      nextRef.current = next;
      if (Math.ceil(total / DOGS_PER_PAGE) !== totalPages) {
        setTotalPages(Math.ceil(total / DOGS_PER_PAGE));
      }
      //fetching dogs using ids
      const dogs = await fetchDogs(resultIds);
      setDogs(dogs);
    } catch (err) {
      if (err.message === "Unauthorized") {
        // Use next/navigation's router to redirect to login.
        router.push("/login");
      } else {
        console.log(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleFavDogs = (dogId) => {
    if (favDogs.includes(dogId)) {
      setFavDogs(favDogs.filter(id => id !== dogId));
      return;
    }
    setFavDogs([...favDogs, dogId]);
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <nav className="flex gap-4 items-center p-4 bg-gray-800 text-white">
        <div>
          <Image src="/fetch-logo-promo.webp" alt="logo" width={50} height={50} />
        </div>
        <div className="ml-auto">
          {favDogs.length === 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <Button
                      onClick={handleMatchDogs}
                      className="outline bg-gray-300 text-black hover:bg-gray-100"
                      disabled
                    >
                      Match Dogs
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Please add favourite dogs to enable matching.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={handleMatchDogs}
              className="outline bg-gray-300 text-black hover:bg-gray-100"
            >
              Match Dogs
            </Button>
          )}
        </div>
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <main className="mb-4">

        <div className="flex justify-between items-center p-4">
          <div className="flex flex-col ">
            <label htmlFor="breed">Choose Breed</label>
            <CustomMultiSelect handleChange={handleBreedChange} id={"breed"} />
          </div>
          <div className="flex flex-col">
            <label>Sort By</label>
            <Select
              value={searchParams.sort}
              onValueChange={(value) => {
                setCurrentPage(1);
                setSearchParams((prev) => ({
                  ...prev,
                  sort: value,
                }))
              }
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breed:asc">Breed Ascending</SelectItem>
                <SelectItem value="breed:desc">Breed Descending</SelectItem>
                <SelectItem value="name:asc">Name Ascending</SelectItem>
                <SelectItem value="name:desc">Name Descending</SelectItem>
                <SelectItem value="age:asc">Age Ascending</SelectItem>
                <SelectItem value="age:desc">Age Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* dogs results */}
        {
          loading ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {Array.from({ length: 20 }).map((_, index) => (
                <SkeletonDogCard key={index} />
              ))}
            </div>
          ) : dogs.length === 0 ? (
            <p>No dogs found</p>
          ) : (
            <DogsList dogs={dogs} handleFavDogs={handleFavDogs} favDogs={favDogs} />
          )
        }
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ideal Dog</DialogTitle>
            </DialogHeader>
            {idealDogLoading ? (
              <SkeletonDogCard />
            ) : idealDog && Object.keys(idealDog).length !== 0 ? (
              <div className="flex flex-col items-center gap-4">
                {idealDog.img && (
                  <Image
                    src={idealDog.img}
                    alt={idealDog.name}
                    width={200}
                    height={200}
                  />
                )}
                <p>Name: {idealDog.name}</p>
                <p>Breed: {idealDog.breed}</p>
                <p>Age: {idealDog.age}</p>
                <p>Zip Code: {idealDog.zip_code}</p>
                {/* Add more details as needed */}
              </div>
            ) : (
              <p>No ideal dog found.</p>
            )}
            <div className="flex justify-end mt-4">
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

    </>
  )
}
