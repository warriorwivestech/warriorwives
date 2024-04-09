export function parseBranchOfService(branch: string) {
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

// parse back label to value from example above in sample
export function parseReverseBranchOfService(
  branchOfService: string,
  includeAny = true
) {
  switch (branchOfService) {
    case "Army":
      return "ARMY";
    case "Navy":
      return "NAVY";
    case "Air Force":
      return "AIR_FORCE";
    case "Coast Guard":
      return "COAST_GUARD";
    case "Marine Corps":
      return "MARINE_CORPS";
    case "Space Force":
      return "SPACE_FORCE";
    default:
      return includeAny ? "ANY" : "ARMY";
  }
}
