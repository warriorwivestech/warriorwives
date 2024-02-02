import { GroupResponse } from "./types";

export function parseGroupData(data: GroupResponse) {
  return {
    ...data,
    tags: data.tags.map((tag: any) => tag.interest.name),
    members: data.members.map((member: any) => ({
      ...member.user,
      admin: member.admin,
    })),
    membersCount: data._count.members,
  };
}