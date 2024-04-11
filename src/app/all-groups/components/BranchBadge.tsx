import { Badge } from "@/components/ui/badge";

export type BranchType =
  | "Any"
  | "Army"
  | "Navy"
  | "Air Force"
  | "Marine Corps"
  | "Coast Guard"
  | "Space Force";

function getBranchBadgeColor(branch: BranchType) {
  switch (branch) {
    case "Army":
      return "bg-green-500 hover:bg-green-600";
    case "Navy":
      return "bg-blue-500 hover:bg-blue-600";
    case "Air Force":
      return "bg-cyan-500 hover:bg-cyan-600";
    case "Marine Corps":
      return "bg-amber-500 hover:bg-amber-600";
    case "Coast Guard":
      return "bg-indigo-500 hover:bg-indigo-600";
    case "Space Force":
      return "bg-purple-500 hover:bg-purple-600";
    default:
      return "";
  }
}

function getBranchBadgeText(branch: BranchType) {
  switch (branch) {
    case "Army":
      return "Army";
    case "Navy":
      return "Navy";
    case "Air Force":
      return "Air Force";
    case "Marine Corps":
      return "Marine Corps";
    case "Coast Guard":
      return "Coast Guard";
    case "Space Force":
      return "Space Force";
    default:
      return "Any";
  }
}

export default function BranchBadge({ branch }: { branch: BranchType }) {
  return (
    <Badge variant="default" className={getBranchBadgeColor(branch)}>
      {getBranchBadgeText(branch)}
    </Badge>
  );
}
