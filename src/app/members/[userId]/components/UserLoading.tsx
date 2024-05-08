import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function UserLoading() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-4 md:px-6 lg:px-8 items-start">
      <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="relative mb-6 md:mb-8 lg:mb-10">
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full" />
        </div>
        <Skeleton className="w-1/2 h-12 mb-6" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="mt-10 text-sm text-gray-700 flex flex-col gap-2 items-center">
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-6 w-96" />
          <Skeleton className="h-6 w-72" />
        </div>
      </div>
      <div className="w-full xl:pt-8 flex flex-col items-center">
        <Skeleton className="w-36 h-8 mb-4 rounded-sm" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2">
          <div className="h-full">
            <Card className="h-full">
              <CardHeader className="p-4">
                <Skeleton className="w-full h-48 rounded-lg" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-col gap-4 justify-between">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="h-full">
            <Card className="h-full">
              <CardHeader className="p-4">
                <Skeleton className="w-full h-48 rounded-lg" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-col gap-4 justify-between">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLoading;
