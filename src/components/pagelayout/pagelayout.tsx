"use client";

import { Box } from "@chakra-ui/react";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="min-h-[70vh] bg-[#F6F7F8] pb-10">
      <div className="max-w-[1440px] m-auto md:px-[48px] py-[48px] px-[24px]">
        {children}
      </div>
    </Box>
  );
};

export default PageLayout;
