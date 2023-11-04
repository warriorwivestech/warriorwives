import { useAppSelector } from "./redux/hooks/hooks";
import { userState } from "./redux/slices/userSlice";

export default function Home() {
  const user = useAppSelector(userState);

  return <div>{user.name}</div>;
}
