import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/ui/typography/muted";
import Link from "next/link";

export default function ExploreEvents() {
  return (
    <div className="mt-8">
      <TypographyMuted>
        No events joined. Explore events from your groups.
      </TypographyMuted>
      <Link href="/groups">
        <Button className="mt-4">View Groups</Button>
      </Link>
    </div>
  );
}
