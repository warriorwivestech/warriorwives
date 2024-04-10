import { Skeleton } from "@/components/ui/skeleton";

export default function AllGroupsLoading() {
  return (
    <>
      <Skeleton className="h-8 w-1/4 mb-4 mt-4" />
      <Skeleton className="h-8 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
    </>
  );
}
