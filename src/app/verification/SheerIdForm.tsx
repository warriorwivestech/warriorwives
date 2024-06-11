"use client";

import { User } from "@prisma/client";
import "./sheerId.css";
import Script from "next/script";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";

export default function SheerIdForm({ user }: { user: User }) {
  const { id } = user;
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>SheerID Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div id="sheerIdForm" className="shadow-md bg-white"></div>
      {/* <Script src="https://cdn.jsdelivr.net/npm/@sheerid/jslib@2.13.0/metrics.js" /> */}
      {/* <Script src="https://cdn.jsdelivr.net/npm/@sheerid/jslib@2.13.0/sheerid.js" /> */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@sheerid/jslib@1/sheerid.js"
        onLoad={() => {
          // @ts-ignore
          const sheerId = window.sheerId;
          sheerId.setOptions({
            logLevel: "info",
          });
          // set userId metadata
          sheerId.setMetadata({
            userId: id,
          });
          const programId = process.env.NEXT_PUBLIC_SHEERID_PROGRAM_ID;
          const formDiv = document.getElementById("sheerIdForm");
          const sheerIdForm = new sheerId.VerificationForm(formDiv, programId);
          // console.log("myForm", myForm);
          // const verificationUrl =
          //   "https://services.sheerid.com/verify/6637bb78d4fbe063c5a4452a/";
          // sheerId.loadInlineIframe(
          //   document.getElementById("my-form"),
          //   verificationUrl
          // );
          // console.log("metadata", sheerId.getMetadata());
        }}
      />
    </>
  );
}
