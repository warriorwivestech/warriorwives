import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BookTextIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function GettingStartedCard() {
  const link = process.env.NEXT_PUBLIC_PLATFORM_GUIDE_URL || "#";

  return (
    <Card className="bg-orange-100 mt-6">
      <CardHeader>
        <CardTitle className="flex">
          <BookTextIcon className="mr-2 h-4 w-4" />
          Platform Guide
        </CardTitle>
        <CardDescription className="text-gray-700 pt-2">
          If you&apos;re new to Warrior Wives Unite or need a refresher on how
          to use the platform, check out our guide to get started. This guide
          will walk you through the features and functionality of our platform,
          and help you get the most out of your experience!
        </CardDescription>
        <Link href={link} target="_blank" rel="noopener noreferrer">
          <Button className="mt-2">Read Guide</Button>
        </Link>
      </CardHeader>
    </Card>
  );
}
