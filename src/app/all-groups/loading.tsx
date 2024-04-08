import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAllGroups() {
  return (
    <>
      <Skeleton className="h-8 w-36 mb-4" />
      <Skeleton className="h-8 w-full mb-4" />
      <Skeleton className="h-16 w-full mb-4" />
      <Skeleton className="h-16 w-full mb-4" />
      <Skeleton className="h-16 w-full mb-4" />
    </>
  );
}
