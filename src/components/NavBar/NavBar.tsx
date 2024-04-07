import { auth } from "@/auth";
import NavBarClient from "./NavBarClient";
import { getUser } from "@/data/user";

export default async function NavBar() {
  const user = await getUser();

  return <NavBarClient user={user} />;
}
