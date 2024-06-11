"use client";

import { SWRProvider } from "@/providers/swrProvider";
import useSWR from "swr";
import { SimilarUsersDataType } from "../api/users/similar/route";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import UserVerifiedRoute from "@/components/UserVerifiedRoute";

function UsersLoading() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
      {Array.from({ length: 3 }).map((_, index) => {
        return (
          <Card key={index} className="h-full">
            <CardContent className="p-2 flex flex-col justify-between">
              <div className="flex items-center p-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="ml-4">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-2 w-36 mt-2" />
                  <Skeleton className="h-2 w-36 mt-2" />
                </div>
              </div>
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function _ConnectPage() {
  const { data, error, isLoading } = useSWR<SimilarUsersDataType>([
    `/users/similar`,
  ]);

  if (isLoading) return <UsersLoading />;
  if (error)
    return (
      <div className="text-sm text-gray-600 mt-4">
        Error loading similar members
      </div>
    );
  if (!data || data.length === 0)
    return (
      <div className="text-sm text-gray-600 mt-4">
        No similar members found. Add more interests to your profile to discover
        more members!
      </div>
    );

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
      {data.map((user) => {
        return (
          <Link key={user.id} href={`/members/${user.id}`} className="h-full">
            <Card className="h-full">
              <CardContent className="p-2 flex flex-col justify-between">
                <div className="flex items-center p-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      alt={user.name as string}
                      src={user.image as string}
                    />
                    <AvatarFallback>
                      {user.name
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">{user.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
                      {user.about
                        ? user.about
                        : `Hi, I'm ${user.name}! Nice to meet you!`}
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  {user.interests.slice(0, 5).map((interest) => {
                    return (
                      <Badge
                        key={`${user.id}-${interest.id}`}
                        variant="secondary"
                      >
                        {interest.name}
                      </Badge>
                    );
                  })}
                  {user.interests.length > 5 && (
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <PlusIcon className="w-3 h-3" />
                      <span>{`{user.interests.length - 5}`} more</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default function ConnectPage() {
  return (
    <UserVerifiedRoute>
      <SWRProvider>
        <TypographyH3>Members with Similar Interests</TypographyH3>
        <_ConnectPage />
      </SWRProvider>
    </UserVerifiedRoute>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
