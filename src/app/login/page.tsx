"use client";

import { Box, Button, Image, Text } from "@chakra-ui/react";
import React from "react";

import { FcGoogle } from "react-icons/fc";
import IconText from "../components/common/icontext";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Box className='w-full h-full flex flex-col justify-center items-center gap-8'>
      <Image
        src='./logo.png'
        width={220}
        height={200}
        alt='logo'
      />
      <Text className='text-heading4 tracking-wide'>Welcome to WarriorWives</Text>
      <Button className='border'>
        <IconText icon={FcGoogle} textClassName='font-normal'>
          <Link href="/">Sign in with Google</Link>
        </IconText>
      </Button>
    </Box>
  );
}
