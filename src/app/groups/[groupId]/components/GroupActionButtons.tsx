import { apiClient } from "@/apiClient";
import { GroupDataType } from "@/app/api/groups/[groupId]/route";
import { UserDataType } from "@/app/api/user/route";
import { CreateEventModal } from "@/components/EventModal/AddEvent";
import EditGroup from "@/components/GroupModal/EditGroup";
import { Button } from "@/components/ui/button";
import { Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { SWRResponse } from "swr";
import useSWRMutation from "swr/mutation";
import GroupPasswordModal from "./GroupPasswordModal";
import { useToast } from "@/components/ui/use-toast";
import { JoinGroupResponseType } from "@/app/api/groups/[groupId]/join/route";

async function joinGroup(
  url: string,
  { arg }: { arg: { password?: string } }
): Promise<JoinGroupResponseType> {
  const response = await apiClient(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
  return response;
}

interface JoinGroupButtonProps {
  groupId: number;
  joined: boolean;
  passwordEnabled: boolean;
  disabled: boolean;
}

function JoinGroupButton({
  groupId,
  joined,
  passwordEnabled,
  disabled,
}: JoinGroupButtonProps) {
  const [justJoined, setJustJoined] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const { toast } = useToast();

  const { data, error, trigger, isMutating } = useSWRMutation(
    `/groups/${groupId}/join`,
    joinGroup,
    {
      onSuccess(data) {
        console.log("DATAAA", data?.data);
        if (data?.data) {
          setJustJoined(true);
          setPasswordModalOpen(false);
          toast({
            title: `Joined Group`,
            description: `You have successfully joined this group.`,
          });
        }
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
        });
      },
    }
  );

  if (joined || justJoined) {
    return (
      <Button variant="secondary" disabled={true}>
        Joined
      </Button>
    );
  }

  if (passwordEnabled) {
    return (
      <GroupPasswordModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        trigger={trigger}
        disabled={isMutating || disabled}
        data={data}
      />
    );
  }

  return (
    <Button onClick={() => trigger({})} disabled={isMutating || disabled}>
      {isMutating ? <Spinner size="sm" /> : "Join Group"}
    </Button>
  );
}

interface GroupActionButtonsProps {
  group: GroupDataType;
  user: SWRResponse<UserDataType, any, any>;
}

export default function GroupActionButtons({
  group,
  user,
}: GroupActionButtonsProps) {
  const { data: userData, isLoading } = user;
  const { id, name, groupAdmin, joined, passwordEnabled } = group;

  if (groupAdmin || userData?.superUser) {
    return (
      <div className="flex flex-col gap-2">
        <EditGroup data={group} />
        <CreateEventModal groupName={name} groupId={id} />
        <JoinGroupButton
          groupId={id}
          joined={joined}
          passwordEnabled={passwordEnabled}
          disabled={isLoading}
        />
      </div>
    );
  }

  return (
    <JoinGroupButton
      groupId={id}
      joined={joined}
      passwordEnabled={passwordEnabled}
      disabled={isLoading}
    />
  );
}
