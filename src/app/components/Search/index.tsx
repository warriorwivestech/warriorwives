"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Input, Spinner } from "@chakra-ui/react";
import { MdOutlineSearch } from "react-icons/md";
import IconText from "../common/icontext";
import { GroupData } from "@/app/api/groups/[groupId]/types";

export default function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setShowDropdown(true);
  };

  // manual debounce
  useEffect(() => {
    setLoading(true);
    const debounceTimeout = setTimeout(() => {
      // TODO: do API call here
      // setgroups the groups after call
      setLoading(false);
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

  return (
    <Flex gap={0} className='flex-col relative'>
      <IconText icon={MdOutlineSearch} textClassName='text-heading5'>
        Search groups by text
      </IconText>
      <div>
        <Input
          className={`w-full mt-4 bg-white !z-20 ${
            showDropdown && !!searchInput ? "rounded-b-none border-b-0" : ""
          }`}
          placeholder='Search for groups...'
          onChange={handleInputChange}
          value={searchInput}
          ref={inputRef}
        />
        {showDropdown && !!searchInput && (
          <Box
            className={`w-full bg-white rounded-b-lg border absolute top-20 max-h-[15rem] overflow-y-scroll z-10 ${
              loading ? "min-h-[5rem] flex justify-center items-center" : ""
            }`}
          >
            {loading ? (
              <Spinner />
            ) : groups.length ? (
              groups.map((group) => (
                <Box
                  className={`w-full px-3 py-2 hover:cursor-pointer hover:bg-gray-100 hover:font-semibold transition ease duration-300`}
                >
                  {group.name},{" "}
                  {group.county
                    ? `${group.county}, ${group.state}`
                    : group.state}
                </Box>
              ))
            ) : (
              <Box className='w-full px-3 py-2 font-semibold'>No groups found.</Box>
            )}
          </Box>
        )}
      </div>
    </Flex>
  );
}
