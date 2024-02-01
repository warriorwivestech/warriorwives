import { HStack, Tag } from "@chakra-ui/react";
import React from "react";

interface TagsProps {
  tags: string[];
}

const Tags = ({ tags }: TagsProps) => {
  return (
    <HStack spacing={2} className='flex-wrap'>
      {tags.map((tag) => (
        <Tag w={"auto"} className='whitespace-nowrap'>
          {tag}
        </Tag>
      ))}
    </HStack>
  );
};

export default Tags;
