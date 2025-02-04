import { Skeleton } from "./ui/skeleton";

function SkeletonDogCard() {
  return (
    <div className="border rounded-md p-4 w-64 shadow-sm">
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full rounded-md" />
      {/* Text placeholders */}
      <Skeleton className="mt-2 h-4 w-3/4 rounded" />
      <Skeleton className="mt-2 h-4 w-1/2 rounded" />
      <Skeleton className="mt-2 h-4 w-1/3 rounded" />
    </div>
  );
}
export default SkeletonDogCard;