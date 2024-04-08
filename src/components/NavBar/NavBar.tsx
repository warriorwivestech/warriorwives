import NavBarClient from "./NavBarClient";
import { getUser } from "@/data/user";
import { signOutUser } from "@/helpers/signOut";

export default async function NavBar() {
  const user = await getUser();

  return <NavBarClient user={user} signOut={signOutUser} />;
}
