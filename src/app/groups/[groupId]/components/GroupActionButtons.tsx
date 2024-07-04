import { apiClient } from "@/apiClient";
import { GroupDataType } from "@/app/api/groups/[groupId]/route";
import { UserDataType } from "@/app/api/user/route";
import CreateEventModal from "@/components/EventModal/AddEvent";
import EditGroup from "@/components/GroupModal/EditGroup";
import { Button } from "@/components/ui/button";
import { Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { KeyedMutator, SWRResponse, mutate } from "swr";
import useSWRMutation from "swr/mutation";
import GroupPasswordModal from "./GroupPasswordModal";
import { useToast } from "@/components/ui/use-toast";
import { JoinGroupResponseType } from "@/app/api/groups/[groupId]/join/route";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getGroupEventsRequestOptions } from "@/app/api/events/helper";

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
        if (data?.data) {
          setJustJoined(true);
          setPasswordModalOpen(false);
          mutate([
            `/groups/${groupId}/events`,
            getGroupEventsRequestOptions(`${groupId}`),
          ]);
          toast({
            title: `Troop Joined`,
            description: `You have successfully joined this troop.`,
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
      <Button variant="secondary" className="w-full" disabled={true}>
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
    <Button
      onClick={() => trigger({})}
      disabled={isMutating || disabled}
      className="w-full"
    >
      {isMutating ? <Spinner size="sm" /> : "Join Troop"}
    </Button>
  );
}

interface GroupActionButtonsProps {
  group: GroupDataType;
  user: SWRResponse<UserDataType, any, any>;
  revalidateData: KeyedMutator<GroupDataType>;
}

export default function GroupActionButtons({
  group,
  user,
  revalidateData,
}: GroupActionButtonsProps) {
  const { data: userData, isLoading } = user;
  const { id, name, groupAdmin, joined, passwordEnabled } = group;

  if (groupAdmin || userData?.superUser) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <CreateEventModal groupName={name} groupId={id} />
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" className="px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  // class="lucide lucide-ellipsis-vertical"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <EditGroup group={group} revalidateData={revalidateData} />
              <Link href={`/groups/${id}/members`} className="w-full">
                <Button variant="outline" className="w-full mt-2">
                  View Members
                </Button>
              </Link>
            </PopoverContent>
          </Popover>
        </div>
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
