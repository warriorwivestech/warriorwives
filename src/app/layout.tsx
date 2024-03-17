import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/header/header";
import Footer from "./components/footer/footer";
import { ChakraProviders } from "./providers/chakraProvider";
import PageLayout from "./components/pagelayout/pagelayout";

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
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body className={inter.className}>
        <ChakraProviders>
          <NavBar />
          <PageLayout>{children}</PageLayout>
          <Footer />
        </ChakraProviders>
      </body>
    </html>
  );
}
