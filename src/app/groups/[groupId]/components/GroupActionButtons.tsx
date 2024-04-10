import { apiClient } from "@/apiClient";
import { GroupDataType } from "@/app/api/groups/[groupId]/route";
import { UserDataType } from "@/app/api/user/route";
import { CreateEventModal } from "@/components/EventModal/AddEvent";
import EditGroup from "@/components/GroupModal/EditGroup";
import { Button } from "@/components/ui/button";
import { UserType } from "@/data/user";
import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SWRResponse } from "swr";
import useSWRMutation from "swr/mutation";

interface GroupActionButtonsProps {
  group: GroupDataType;
  user: SWRResponse<UserDataType, any, any>;
  correctPassword: boolean;
  onOpen: () => void;
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
  correctPassword,
  onOpen,
}: GroupActionButtonsProps) {
  const { data: userData, isLoading } = user;
  const { id, name, groupAdmin, joined } = group;
  const [justJoined, setJustJoined] = useState(false);

  const { trigger, isMutating } = useSWRMutation("/groups/join", joinGroup, {
    onSuccess: () => {
      setJustJoined(true);
    },
  });

  useEffect(() => {
    if (correctPassword) {
      trigger({ groupId: id });
    }
  }, [correctPassword, id, trigger]);

  if (groupAdmin || userData?.superUser) {
    return (
      <div className="flex flex-col gap-2">
        <EditGroup data={group} />
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
        if (group?.passwordEnabled) {
          onOpen();
          return;
        }

        trigger({ groupId: id });
      }}
      disabled={isLoading || isMutating}
    >
      {isMutating ? <Spinner /> : "Join Group"}
    </Button>
  );
}
