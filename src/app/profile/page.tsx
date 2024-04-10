"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notFound, usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import ProfileForm from "./components/ProfileForm";
import { SWRProvider } from "@/providers/swrProvider";
import useSWR from "swr";
import { getUserRequestOptions } from "../api/user/helper";
import { InterestsType } from "../api/interests/route";
import { getInterestsRequestOptions } from "../api/interests/helper";
import { UserDataType } from "../api/user/route";
import LoadingProfileForm from "./components/LoadingProfileForm";
import { TypographyH3 } from "@/components/ui/typography/h3";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/profile",
  },
];

function _ProfilePage() {
  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR<UserDataType>(["/user", getUserRequestOptions()]);
  const {
    data: interestsData,
    error: interestsError,
    isLoading: interestsAreLoading,
  } = useSWR<InterestsType>(["/interests", getInterestsRequestOptions()]);

  const pathname = usePathname();

  const isLoading = userIsLoading || interestsAreLoading;
  const error = userError || interestsError;

  if (isLoading) {
    return <LoadingProfileForm />;
  }
  if (error) {
    return <div className="mt-4">Error loading profile</div>;
  }
  if (!userData || !interestsData) return notFound();

  return (
    <div className="space-y-6 px-10 pb-16 pt-0 md:px-0">
      <div className="space-y-0.5">
        <TypographyH3>My Account</TypographyH3>
        <p className="text-muted-foreground pt-2">
          Manage your profile and interests
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav
            className={cn(
              "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"
            )}
          >
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Profile Settings</h3>
              <p className="text-sm text-muted-foreground pt-1">
                Update your name and interests here.
              </p>
            </div>
            <Separator />
            <ProfileForm user={userData} interests={interestsData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <SWRProvider>
      <_ProfilePage />
    </SWRProvider>
  );
}
