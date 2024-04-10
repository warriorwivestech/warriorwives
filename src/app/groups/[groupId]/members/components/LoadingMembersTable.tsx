import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingMembersTable() {
  return (
    <>
      <Skeleton className="h-8 w-full mb-4 mt-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
    </>
  );
}
