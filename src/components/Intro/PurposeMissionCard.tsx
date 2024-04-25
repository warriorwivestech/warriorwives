import { RocketIcon, TargetIcon } from "@radix-ui/react-icons";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function PurposeMissionCard() {
  return (
    <Card className="bg-gray-100 mt-6">
      <CardHeader>
        <CardTitle className="flex">
          <TargetIcon className="mr-2 h-4 w-4" />
          <div>Purpose</div>
        </CardTitle>
        <CardDescription>
          To be an outreach organization in support of military wives; To
          provide prayer, encouragement and fundamental training resources for
          women that goes beyond the limitations of local, state and federal
          agencies; To unite women with others in their geographical area,
          regardless of branch, duty status or unit association; and to promote
          one another through all stages of military service through faith in
          Jesus Christ.
        </CardDescription>
        <CardTitle className="flex pt-4">
          <RocketIcon className="mr-2 h-4 w-4" />
          <div>Mission</div>
        </CardTitle>
        <CardDescription>
          {
            "Preparing military wives for life's daily battles; through prayer, training and relationship-building."
          }
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
