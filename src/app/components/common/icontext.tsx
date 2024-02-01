import { Flex, Icon, IconProps, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
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
    <Flex gap={2} alignItems='center' className='test flex-[0 0 auto]'>
      {icon && <Icon as={icon} className={iconClassName} />}
      <Text
        className={`whitespace-nowrap ${textClassName}`}
      >
        {children}
      </Text>
    </Flex>
  );
};

export default IconText;
