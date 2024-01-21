import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warrior Wives",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
