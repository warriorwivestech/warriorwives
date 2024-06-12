import { SWRProvider } from "@/providers/swrProvider";
import { TypographyH3 } from "@/components/ui/typography/h3";
import UserVerifiedRoute from "@/components/UserVerifiedRoute";
import ConnectPageClient from "./ConnectPageClient";

export default function ConnectPage() {
  return (
    <UserVerifiedRoute>
      <SWRProvider>
        <TypographyH3>Members with Similar Interests</TypographyH3>
        <ConnectPageClient />
      </SWRProvider>
    </UserVerifiedRoute>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
