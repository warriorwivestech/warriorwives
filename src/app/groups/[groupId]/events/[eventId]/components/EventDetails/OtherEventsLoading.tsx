import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OtherEventsLoading() {
  return (
    <div className="flex flex-row gap-4 overflow-x-scroll pb-2 pl-1">
      <Card className="min-w-[340px] md:min-w-[450px] h-72">
        <div className="p-4 flex flex-col gap-6 w-full">
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="w-1/4 h-4" />
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-1/2 h-4" />
            </div>
            <Skeleton className="h-48 sm:h-32 sm:w-64" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </Card>
      <Card className="min-w-[340px] md:min-w-[450px] h-72">
        <div className="p-4 flex flex-col gap-6 w-full">
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="w-1/4 h-4" />
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-1/2 h-4" />
            </div>
            <Skeleton className="h-48 sm:h-32 sm:w-64" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </Card>
    </div>
  );
}
