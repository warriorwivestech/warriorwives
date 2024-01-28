import type { Metadata } from "next";
import { Box } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/header/header";
import Footer from "./components/footer/footer";
import { ChakraProviders } from "./providers/chakraProvider";

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
          <Box className="min-h-[70vh] bg-[#F6F7F8] pb-10">
            <div className=" max-w-[1440px] m-auto md:px-[48px] py-[48px] px-[24px]">
              {children}
            </div>
          </Box>
          <Footer />
        </ChakraProviders>
      </body>
    </html>
  );
}
