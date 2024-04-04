import { Flex, Icon, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { IconType } from "react-icons";

interface IconTextProps {
  icon?: IconType;
  textClassName?: string;
  iconClassName?: string;
  children?: ReactNode;
}

const IconText = ({
  icon,
  children,
  iconClassName,
  textClassName,
}: IconTextProps) => {
  return (
    <Flex gap={2} alignItems="center" className="flex-[0 0 auto]">
      {icon && <Icon as={icon} className={iconClassName} />}
      <Text className={`whitespace-nowrap ${textClassName}`}>{children}</Text>
    </Flex>
  );
};

export default IconText;
