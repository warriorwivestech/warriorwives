"use client";

import React, { useState, useEffect, useRef } from "react";
import { Badge, Box, Flex, HStack, Input, Spinner } from "@chakra-ui/react";
import { MdOutlineSearch } from "react-icons/md";
import IconText from "../common/icontext";
import { GroupData } from "@/app/api/groups/[groupId]/types";
import Link from "next/link";
import Tags from "../common/tags";
import { SWRProvider, fetcher } from "@/providers/swrProvider";
import useSWR, { preload } from "swr";
import { getSingleGroupRequestOptions } from "@/app/api/groups/helper";

function _Search() {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [debounceLoading, setDebounceLoading] = useState(false);

  const fetchOptions: RequestInit = {
    cache: "force-cache",
    next: { tags: ["groups", textSearch], revalidate: 60 * 5 },
  };
  const {
    data: groups,
    error,
    isLoading: groupsAreLoading,
  } = useSWR<GroupData[]>(
    textSearch ? [`/groups/search?text=${textSearch}`, fetchOptions] : null
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setShowDropdown(true);
  };

  // manual debounce
  useEffect(() => {
    setDebounceLoading(true);
    const debounceTimeout = setTimeout(() => {
      if (!searchInput) {
        setTextSearch("");
        setDebounceLoading(false);
        return;
      }
      setTextSearch(searchInput);
      setDebounceLoading(false);
    }, 250);

    return () => clearTimeout(debounceTimeout);
  }, [searchInput]);

  const handleClickOutside = (event: any) => {
    if (!inputRef.current) return;
    if (inputRef.current.contains(event.target)) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const SearchResults = () => {
    const boxClasses = `w-full bg-white rounded-b-lg border absolute top-20 max-h-[15rem] overflow-y-scroll z-10`;
    const searchIsLoading = debounceLoading || groupsAreLoading;
    const loadingBoxClasses = searchIsLoading
      ? "min-h-[5rem] flex justify-center items-center"
      : "";

    if (!showDropdown || !searchInput) return;
    if (searchIsLoading)
      return (
        <Box className={`${boxClasses} ${loadingBoxClasses}`}>
          <Spinner />
        </Box>
      );
    if (error)
      return (
        <Box className={boxClasses}>
          <Box className="w-full px-3 py-2 font-semibold">
            Error loading groups.
          </Box>
        </Box>
      );
    if (!groups || groups.length === 0)
      return (
        <Box className={boxClasses}>
          <Box className="w-full px-3 py-2 font-semibold">No groups found.</Box>
        </Box>
      );

    return (
      <Box className={boxClasses}>
        {groups.map((group) => (
          <Link
            href={`/groups/${group.id}`}
            key={group.id}
            onMouseEnter={() => {
              preload(
                [
                  `/groups/${group.id}`,
                  getSingleGroupRequestOptions(group.id.toString()),
                ],
                fetcher
              );
            }}
          >
            <Box className="w-full px-3 py-2 hover:cursor-pointer hover:bg-gray-100 hover:font-semibold transition ease duration-300 flex justify-between">
              <Box>
                {group.name},{" "}
                {group.county ? `${group.county}, ${group.state}` : group.state}
              </Box>
              <Box>
                <HStack spacing={2} className="flex-wrap">
                  <Badge
                    w={"auto"}
                    className="px-[4px] py-[2px] rounded-sm"
                    colorScheme="gray"
                  >
                    {group.branchOfService === "Any"
                      ? "All Branches"
                      : group.branchOfService}
                  </Badge>
                  <Tags tags={group.tags} />
                </HStack>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    );
  };

  return (
    <Flex gap={0} className="flex-col relative">
      <IconText icon={MdOutlineSearch} textClassName="text-heading5">
        Search groups by text
      </IconText>
      <div>
        <Input
          className={`w-full mt-4 bg-white !z-20 ${
            showDropdown && !!searchInput ? "rounded-b-none border-b-0" : ""
          }`}
          placeholder="Search for groups..."
          onChange={handleInputChange}
          value={searchInput}
          ref={inputRef}
        />
        <SearchResults />
      </div>
    </Flex>
  );
}

export default function Search() {
  return (
    <SWRProvider>
      <_Search />
    </SWRProvider>
  );
}
