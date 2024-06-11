import prisma from "@/prisma";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const url = request.url;
  const searchParams = new URLSearchParams(url);
  const userId = searchParams.get("userId");
  const verificationId = searchParams.get("verificationId");

  if (!userId || !verificationId) {
    return redirect("../../verification");
  }

  const verificationResponse = await fetch(
    `https://services.sheerid.com/rest/v2/verification/${verificationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const verificationData = await verificationResponse.json();
  const currentStep = verificationData.currentStep;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  if (user.manualVerified) {
    return redirect("../../");
  }

  if (user.sheerIdVerified) {
    return redirect("../../verification");
  }

  if (currentStep === "success") {
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        sheerIdVerificationId: verificationId,
        sheerIdVerified: true,
        manualVerified: true,
      },
    });
    return redirect("../../");
  } else if (currentStep === "error") {
    const systemErrorMessage = verificationData.systemErrorMessage;

    return redirect("../../verification?error=" + systemErrorMessage);
  } else {
    return redirect("../../verification");
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  const verificationId = data.verificationId;
  console.log("verificationId:", verificationId);

  if (!verificationId) {
    return Response.json({ success: true });
  }

  const verificationResponse = await fetch(
    `https://services.sheerid.com/rest/v2/verification/${verificationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const verificationData = await verificationResponse.json();
  console.log("verificationData:", verificationData);

  const currentStep = verificationData.currentStep;
  const redirectUrl = verificationData.redirectUrl;

  if (currentStep === "success") {
    const redirectUrlSearchParams = new URLSearchParams(redirectUrl);
    const userId = redirectUrlSearchParams.get("userId");

    if (!userId) {
      return Response.json({ success: true });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        sheerIdVerificationId: verificationId,
        sheerIdVerified: true,
        manualVerified: true,
      },
    });
  }

  return Response.json({ success: true });
}
