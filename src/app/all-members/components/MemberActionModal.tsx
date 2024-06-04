"use client";

import { apiClient } from "@/apiClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

interface MemberActionModalProps {
  action: "promote" | "demote" | "verify" | "unverify";
  userId: number;
  name: string;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
}

function getActionData(action: MemberActionModalProps["action"], name: string) {
  switch (action) {
    case "promote":
      return {
        title: `Promote ${name} to Super Admin?`,
        description:
          "WARNING: This will grant all super admin privileges to this user. Super admins have the ability to demote other super admins. Only proceed if you completely trust this user.",
        actionText: "Promote to Super Admin",
        successTitle: "Member Promoted",
        successMessage: `${name} has been successfully promoted to super admin!`,
        modalAction: "Promote",
      };
    case "demote":
      return {
        title: `Demote ${name} from Super Admin?`,
        description:
          "This will remove all super admin privileges from this user.",
        actionText: "Demote from Super Admin",
        successTitle: "Member Demoted",
        successMessage: `${name} has been successfully demoted from super admin!`,
        modalAction: "Demote",
      };
    case "verify":
      return {
        title: `Manually verify ${name}?`,
        description:
          "This will grant the user access to the platform even if they are not verified through SheerID.",
        actionText: "Manually verify",
        successTitle: "Member Verified",
        successMessage: `${name} has been successfully verified!`,
        modalAction: "Verify",
      };
    case "unverify":
      return {
        title: `Revoke verification for ${name}?`,
        description:
          "This will revoke the user's access to the platform and mark them as unverified.",
        actionText: "Revoke verification",
        successTitle: "Verification Revoked",
        successMessage: `Access successfully revoked for ${name}!`,
        modalAction: "Revoke",
      };
  }
}

async function updateUser(
  url: string,
  { arg }: { arg: { action: "promote" | "demote" | "verify" | "unverify" } }
) {
  await apiClient(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });
}

export default function MemberActionModal({
  action,
  userId,
  name,
  setDropdownOpen,
}: MemberActionModalProps) {
  const { toast } = useToast();
  const {
    title,
    description,
    actionText,
    successTitle,
    successMessage,
    modalAction,
  } = getActionData(action, name);

  const [isRevalidating, setIsRevalidating] = useState(false);
  const { trigger, isMutating } = useSWRMutation(
    `/users/${userId}`,
    updateUser,
    {
      onSuccess: () => {
        mutate(["/users"]);
        toast({
          title: successTitle,
          description: successMessage,
        });
        setDropdownOpen(false);
      },
      onError: (error) => {
        setIsRevalidating(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      },
    }
  );
  const disabled = isMutating || isRevalidating;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={disabled}
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          {disabled ? <Spinner size="sm" /> : actionText}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setIsRevalidating(true);
              trigger({ action });
            }}
            disabled={disabled}
          >
            {modalAction}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
