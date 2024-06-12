/* eslint-disable react/no-unescaped-entities */
"use client";

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { JSX, SVGProps } from "react";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BranchBadge, {
  BranchType,
} from "@/app/all-groups/components/BranchBadge";
import useSWR from "swr";
import NotFound from "@/app/not-found";
import { PublicUserResponse } from "@/app/api/users/[userId]/public/route";
import UserLoading from "./components/UserLoading";

function FacebookIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  );
}

export default function UserProfilePageClient({
  params,
}: {
  params: { userId: string };
}) {
  const { data, error, isLoading } = useSWR<PublicUserResponse>([
    `/users/${params.userId}/public`,
  ]);

  if (isLoading) return <UserLoading />;
  if (error)
    return <div className="text-sm text-gray-600">Error loading user</div>;
  if (!data || data.error || !data.data) return <NotFound />;

  const user = data.data;
  const { name, image, about, facebook, instagram, twitter, linkedin } = user;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-4 md:px-6 lg:px-8 items-start">
      <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="relative mb-6 md:mb-8 lg:mb-10">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40">
            <AvatarImage alt={name as string} src={image as string} />
            <AvatarFallback className="text-2xl">
              {name
                ?.split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className="mb-8 text-3xl font-bold md:text-4xl lg:text-5xl text-center">
          {name}
        </h1>
        <div className="mb-5">
          <BranchBadge branch={user.branch as BranchType} />
        </div>
        <div className="mb-8 max-w-xl flex flex-wrap items-center justify-center gap-2 md:gap-3 lg:gap-4">
          {user.interests.map((interest) => (
            <Badge key={interest.id}>{interest.name}</Badge>
          ))}
        </div>
        <div className="mb-8 max-w-2xl text-center text-gray-500">
          <p>{about ? about : `Hi, I'm ${name}! Nice to meet you!`}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8">
          {facebook && (
            <Link
              className="inline-flex items-center gap-1"
              href={`https://facebook.com/${facebook}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon className="h-5 w-5" />
              <span className="text-sm">{facebook}</span>
            </Link>
          )}
          {instagram && (
            <Link
              className="inline-flex items-center gap-1"
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramLogoIcon className="h-5 w-5" />
              <span className="text-sm">{instagram}</span>
            </Link>
          )}
          {twitter && (
            <Link
              className="inline-flex items-center gap-1"
              href={`https://twitter.com/${twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <XIcon className="h-4 w-4" />
              <span className="text-sm">{twitter}</span>
            </Link>
          )}
          {linkedin && (
            <Link
              className="inline-flex items-center gap-1"
              href={`https://linkedin.com/in/${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInLogoIcon className="h-5 w-5" />
              <span className="text-sm">{linkedin}</span>
            </Link>
          )}
        </div>
        <p className="mt-8 text-sm text-gray-700">
          A Warrior Wife since{" "}
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="w-full xl:pt-8 flex flex-col items-center">
        <h2 className="mb-4 text-2xl font-bold">
          Groups Joined ({user.groups.length})
        </h2>
        {user.groups.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2">
            {user.groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="h-full"
              >
                <Card className="h-full">
                  <CardHeader className="p-4">
                    <Image
                      alt={group.name}
                      className="w-full rounded-lg object-cover"
                      height={200}
                      src={group.displayPhoto}
                      style={{
                        aspectRatio: "300/200",
                        objectFit: "cover",
                      }}
                      width={300}
                    />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="flex flex-col gap-4 justify-between">
                      <h3 className="text-lg font-bold">{group.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.tags.map((tag) => (
                          <Badge key={tag.id}>{tag.name}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            {name} has not joined any groups yet.
          </div>
        )}
      </div>
    </div>
  );
}
