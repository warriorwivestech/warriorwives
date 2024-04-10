import { notFound } from "next/navigation";
import { getUser } from "@/data/user";
import MembersTable from "./components/MembersTable";
import { checkIfUserIsGroupAdmin, getGroupName } from "@/data/groupMembers";
import { TypographyH3 } from "@/components/ui/typography/h3";

export default async function AllMembers({
  params,
}: {
  params: { groupId: string };
}) {
  const parsedGroupId = Number(params.groupId);
  const [user, userIsGroupAdmin, groupName] = await Promise.all([
    getUser(),
    checkIfUserIsGroupAdmin(parsedGroupId),
    getGroupName(parsedGroupId),
  ]);

  const { data: userData, error } = user;

  const userOrMembersDataNotFound = !userData;
  const userAuthorized = userData?.superUser || userIsGroupAdmin;

  if (userOrMembersDataNotFound || error || !userAuthorized) {
    return notFound();
  }

  const groupData = { id: parsedGroupId, name: groupName as string };

  return (
    <>
      <TypographyH3>All Members of {groupData.name}</TypographyH3>
      <MembersTable
        user={userData}
        userIsAdmin={userIsGroupAdmin}
        groupData={groupData}
      />
    </>
  );
}
