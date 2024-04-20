import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Page Not Found</CardTitle>
          <CardDescription className="text-center">
            Could not find requested resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/">
            <Button className="w-full">Return Home</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
