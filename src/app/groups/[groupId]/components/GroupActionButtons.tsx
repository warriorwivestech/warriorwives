import { apiClient } from "@/apiClient";
import { GroupDataType } from "@/app/api/groups/[groupId]/route";
import { UserType } from "@/app/api/user/route";
import { CreateEventModal } from "@/components/CreateEventModal";
import { CreateGroupModal } from "@/components/CreateGroupModal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { SWRResponse } from "swr";
import useSWRMutation from "swr/mutation";

interface GroupActionButtonsProps {
  group: GroupDataType;
  user: SWRResponse<UserType, any, any>;
}

async function joinGroup(url: string, { arg }: { arg: { groupId: number } }) {
  await apiClient(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

export default function GroupActionButtons({
  group,
  user,
}: GroupActionButtonsProps) {
  const { data: userData, isLoading } = user;
  const { id, name, groupAdmin, joined } = group;
  const [justJoined, setJustJoined] = useState(false);

  const { trigger, isMutating } = useSWRMutation("/groups/join", joinGroup, {
    onSuccess: () => {
      setJustJoined(true);
    },
  });

  if (groupAdmin || userData?.superUser) {
    return (
      <div className="flex flex-col gap-2">
        <CreateGroupModal data={group} />
        <CreateEventModal groupName={name} groupId={id} />
      </div>
    );
  }

  if (joined || justJoined) {
    return <Button disabled={true}>Joined</Button>;
  }

  return (
    <Button
      onClick={() => {
        trigger({ groupId: id });
      }}
      disabled={isLoading || isMutating}
    >
      {isMutating ? <Spinner /> : "Join Group"}
    </Button>
  );
}
