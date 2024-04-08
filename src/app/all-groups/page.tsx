import { notFound } from "next/navigation";
import { getUser } from "@/data/user";
import GroupsTables from "./components/GroupsTables";

export default async function AllGroups() {
  const user = await getUser();

  if (!user.data?.superUser) {
    return notFound();
  }

  return <GroupsTables />;
}
