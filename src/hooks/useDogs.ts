// // lib/hooks/useDogs.ts
// "use client"

// import useSWR from 'swr'
// import { fetcher } from '@/lib/fetcher'
// import { Dog } from '@/lib/types'

// interface DogsSearchData {
//   resultIds: string[]
//   total: number
//   next?: string
//   prev?: string
// }

// interface DogsResponse extends DogsSearchData {
//   dogs: Dog[]
// }

// interface UseDogsParams {
//   breed?: string
//   sort?: string // e.g. "breed:asc"
//   size?: number
//   from?: number
// }

// export function useDogs({ breed, sort, size = 5, from = 0 }: UseDogsParams) {
//   // Build the query string
//   let queryParams = new URLSearchParams()
//   if (breed) queryParams.append('breeds', breed)
//   if (sort) queryParams.append('sort', sort)
//   if (size) queryParams.append('size', size.toString())
//   if (from > 0) queryParams.append('from', from.toString())

//   const url = `/dogs/search?${queryParams.toString()}`

//   // SWR: fetch the search results (IDs)
//   const {
//     data: searchData,
//     error,
//     isLoading,
//   } = useSWR<DogsSearchData>(url, fetcher)

//   // Next step: we want to fetch the actual dog objects.
//   // We can do a small "derived SWR" or just do it inline:
//   // However, the recommended approach is a single custom fetcher in the first place:
//   // We'll do a second approach below. But let's keep it simple with "conditional fetch".

//   // 1) We only POST /dogs if we have searchData.resultIds
//   // 2) We'll do a separate SWR or a local state with "mutate"

//   // For a simpler approach, let's do a "chain" inside the fetcher itself:
//   // That means we won't need two SWRs. We'll do a single fetcher that returns { resultIds, dogs, ... }.

//   // Let's just transform the above approach to a single SWR with a custom fetcher:

//   const {
//     data: dogsData,
//     error: dogsError,
//     isLoading: isDogsLoading,
//   } = useSWR<DogsResponse>(
//     searchData
//       ? // key for the second fetch
//         ['/dogs/search-chain', searchData] // a unique key with search data
//       : null,
//     // the fetcher
//     async ([, searchResult]) => {
//       const { resultIds, total, next, prev } = searchResult
//       if (resultIds.length === 0) {
//         return { resultIds, total, next, prev, dogs: [] }
//       }
//       // fetch the dog objects
//       const { data: dogs } = await api.post<Dog[]>('/dogs', resultIds)
//       return { resultIds, total, next, prev, dogs }
//     }
//   )

//   return {
//     dogsData: dogsData,
//     error: error || dogsError,
//     isLoading: isLoading || isDogsLoading,
//   }
// }
