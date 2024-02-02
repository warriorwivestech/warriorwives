import { GroupsByUserIdResponse } from "./types";

function parseBranchOfService(branch: string) {
  // convert branch of service to a more readable format
  // ARMY -> Army
  // NAVY -> Navy
  // AIR_FORCE -> Air Force
  // MARINES -> Marines
  // COAST_GUARD -> Coast Guard
  return branch
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export function parseGroupsByUserIdResponse(data: GroupsByUserIdResponse) {
  return data.map((group) => {
    return {
      ...group.group,
      branchOfService: parseBranchOfService(group.group.branchOfService),
      tags: group.group.tags.map((tag) => tag.interest.name),
      admin: group.admin,
    };
  });
}