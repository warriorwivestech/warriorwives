import React from "react";
import { Divider, Flex } from "@chakra-ui/react";
import Map from "../components/Map";
import Search from "../components/Search";
import Intro from "@/components/Intro";
import { auth } from "@/auth";
import PurposeMissionCard from "@/components/Intro/PurposeMissionCard";
import { TypographyH2 } from "@/components/ui/typography/h2";
import SignInCard from "./sign-in/components/SignInCard";
import { Button } from "@/components/ui/button";
import UserVerifiedRoute from "@/components/UserVerifiedRoute";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex">
        <div className="flex flex-col md:w-1/2 min-h-[60vh] justify-center items-center align-middle">
          <TypographyH2>Welcome to WarriorWives!</TypographyH2>
          <PurposeMissionCard />
          <a className="flex w-full justify-center md:hidden" href="/sign-in">
            <Button className="sm:w-28 w-full mt-4">Sign In</Button>
          </a>
        </div>
        <div className="hidden sm:ml-4 md:w-1/2 md:block">
          <SignInCard />
        </div>
      </div>
    );
  }

  return (
    <UserVerifiedRoute>
      <Flex className="flex-col gap-10 mb-4">
        <Intro />
        <Divider />
        <Search />
        <Divider />
        <Map />
      </Flex>
    </UserVerifiedRoute>
  );
}
