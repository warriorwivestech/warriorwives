import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import MemberActionModal from "./MemberActionModal";
import { useState } from "react";

interface ActionsMenuProps {
  id: number;
  superUser: boolean;
  manualVerified: boolean;
  name: string;
}

export default function ActionsMenu({
  id,
  superUser,
  manualVerified,
  name,
}: ActionsMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={`members/${id}`} target="blank" rel="noopener noreferrer">
          <DropdownMenuItem className="cursor-pointer">
            View member
          </DropdownMenuItem>
        </Link>
        {manualVerified ? (
          <MemberActionModal
            action="unverify"
            userId={id}
            name={name}
            setDropdownOpen={setDropdownOpen}
          />
        ) : (
          <MemberActionModal
            action="verify"
            userId={id}
            name={name}
            setDropdownOpen={setDropdownOpen}
          />
        )}
        {superUser ? (
          <MemberActionModal
            action="demote"
            userId={id}
            name={name}
            setDropdownOpen={setDropdownOpen}
          />
        ) : (
          <MemberActionModal
            action="promote"
            userId={id}
            name={name}
            setDropdownOpen={setDropdownOpen}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
