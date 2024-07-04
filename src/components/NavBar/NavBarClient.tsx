"use client";

import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { UserDataType } from "@/data/user";
import UnauthenticatedNavBar from "./UnauthenticatedNavBar";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

const NAV_ITEMS = [
  {
    label: "My Troops",
    href: "/groups",
  },
  {
    label: "My Events",
    href: "/events",
  },
  {
    label: "Community",
    href: "/community",
  },
];

const SUPER_USER_NAV_ITEMS = [
  {
    label: "All Troops",
    href: "/all-groups",
  },
  {
    label: "All Members",
    href: "/all-members",
  },
];

interface NavBarClientProps {
  user: UserDataType | undefined;
  signOut: () => Promise<never>;
}

export default function NavBarClient({ user, signOut }: NavBarClientProps) {
  const [desktopSize] = useMediaQuery("(min-width: 1024px)");
  const { isOpen, onToggle } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.600", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.900");

  if (!user) {
    return <UnauthenticatedNavBar />;
  }

  const allNavItems = user?.manualVerified
    ? user?.superUser
      ? [...NAV_ITEMS, ...SUPER_USER_NAV_ITEMS]
      : NAV_ITEMS
    : [];

  return (
    <Box>
      <Flex
        bg={bgColor}
        color={color}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={borderColor}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          alignItems={"center"}
          marginLeft={{ base: "0", md: "2rem" }}
        >
          <Link href="/">
            <Image src="/logo.png" width={50} height={50} alt="logo" />
          </Link>
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav navItems={allNavItems} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <UserAvatar name={user.name} image={user.image} signOut={signOut} />
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={allNavItems} />
      </Collapse>
    </Box>
  );
}

function DesktopNav({
  navItems,
}: {
  navItems: { href: string; label: string }[];
}) {
  const color = useColorModeValue("gray.600", "gray.200");
  const hoverColor = useColorModeValue("gray.800", "white");

  return (
    <Stack direction={"row"} spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link href={navItem.href}>
                <Box
                  p={2}
                  fontSize={"sm"}
                  fontWeight={500}
                  color={color}
                  _hover={{
                    textDecoration: "none",
                    color: hoverColor,
                  }}
                >
                  {navItem.label}
                </Box>
              </Link>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
}

function MobileNav({
  navItems,
}: {
  navItems: { href: string; label: string }[];
}) {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack bg={bgColor} p={4} display={{ md: "none" }}>
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
}

function MobileNavItem({
  label,
  href,
  subLabel,
}: {
  label: string;
  href: string;
  subLabel?: string;
}) {
  const { isOpen, onToggle } = useDisclosure();
  const color = useColorModeValue("gray.600", "gray.200");

  return (
    <Stack spacing={4} onClick={onToggle}>
      <Link href={href}>
        <Box
          py={2}
          justifyContent="space-between"
          alignItems="center"
          _hover={{
            textDecoration: "none",
          }}
        >
          <Text fontWeight={600} color={color}>
            {label}
          </Text>
        </Box>
      </Link>
    </Stack>
  );
}
