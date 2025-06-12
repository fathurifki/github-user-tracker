import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoading() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4 items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-col space-y-2 flex-1 ">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
