import { HStack, Tag } from "@chakra-ui/react";
import React from "react";

interface TagsProps {
  tags: string[];
}

const Tags = ({ tags }: TagsProps) => {
  return (
    <HStack spacing={2} className='flex-wrap'>
      {tags?.map((tag, index) => (
        <Tag w={"auto"} className='whitespace-nowrap' key={index}>
          {tag}
        </Tag>
      ))}
    </HStack>
  );
};

export default Tags;
