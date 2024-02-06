import { HStack, Tag } from "@chakra-ui/react";
import React from "react";
import { generateColorFromString } from "../Map";

interface TagsProps {
  tags: string[];
}

const Tags = ({ tags }: TagsProps) => {
  return (
    <HStack spacing={2} className='flex-wrap'>
      {tags?.map((tag, index) => (
        <Tag
          w={"auto"}
          className='whitespace-nowrap'
          key={index}
          background={generateColorFromString(tag, "40")}
        >
          {tag}
        </Tag>
      ))}
    </HStack>
  );
};

export default Tags;
