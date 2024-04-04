import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <>
      <ClerkLoading>Loading ...</ClerkLoading>
      <ClerkLoaded>
        <SignUp />
      </ClerkLoaded>
    </>
  );
}
