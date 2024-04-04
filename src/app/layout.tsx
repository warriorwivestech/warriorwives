import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "../components/header/header";
import Footer from "../components/footer/footer";
import { ChakraProviders } from "../providers/chakraProvider";
import PageLayout from "../components/pagelayout/pagelayout";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Warrior Wives",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
        <body className={inter.className}>
          <ChakraProviders>
            <NavBar />
            <PageLayout>{children}</PageLayout>
            <Footer />
          </ChakraProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
