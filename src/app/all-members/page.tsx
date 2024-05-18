import { notFound } from "next/navigation";
import { getUser } from "@/data/user";
import { TypographyH3 } from "@/components/ui/typography/h3";
import MembersTable from "./components/MembersTable";

export default async function AllMembers() {
  const user = await getUser();

  if (!user.data?.superUser) {
    return notFound();
  }

  return (
    <>
      <TypographyH3>All Members</TypographyH3>
      <MembersTable />
    </>
  );
}
