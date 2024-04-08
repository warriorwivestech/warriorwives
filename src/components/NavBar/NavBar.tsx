import NavBarClient from "./NavBarClient";
import { getUser } from "@/data/user";
import { signOutUser } from "@/helpers/signOut";

export default async function NavBar() {
  const { data: userData } = await getUser();

  return <NavBarClient user={userData} signOut={signOutUser} />;
}
