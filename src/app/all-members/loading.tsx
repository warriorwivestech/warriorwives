import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3 } from "@/components/ui/typography/h3";

export default function LoadingAllMembers() {
  return (
    <>
      <TypographyH3>All Members</TypographyH3>
      <Skeleton className="h-8 w-1/4 mb-4 mt-4" />
      <Skeleton className="h-8 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
    </>
  );
}
