import { notFound, redirect } from "next/navigation";
import { getUser } from "@/data/user";
import GroupsTables from "./components/GroupsTables";
import { TypographyH3 } from "@/components/ui/typography/h3";

export default async function AllGroups() {
  const user = await getUser();

  if (!user.data?.manualVerified) {
    return redirect("/verification");
  }

  if (!user.data?.superUser) {
    return notFound();
  }

  return (
    <>
      <TypographyH3>All Groups</TypographyH3>
      <GroupsTables />
    </>
  );
}
