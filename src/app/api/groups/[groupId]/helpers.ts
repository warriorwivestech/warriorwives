import { parseBranchOfService } from "@/app/data/helpers";
import { GroupResponse } from "./types";

export function parseGroupData(
  data: GroupResponse,
  memberData: { admin: boolean } | null,
  adminData: { user: { name: string } }[]
) {
  return {
    ...data,
    branchOfService: parseBranchOfService(data.branchOfService),
    tags: data.tags.map((tag: any) => tag.interest.name),
    membersCount: data._count.members,
    joined: memberData ? true : false,
    groupAdmin: memberData ? memberData.admin : false,
    admins: adminData.map((admin) => admin.user.name),
  };
}
