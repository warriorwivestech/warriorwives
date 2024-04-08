import { signOut } from "@/auth";

export async function signOutUser() {
  "use server";
  return await signOut({
    redirectTo: "/",
  });
}
