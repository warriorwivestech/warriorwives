"use client";

import React from "react";
import IconText from "../common/icontext";
import { TbTargetArrow } from "react-icons/tb";
import { IoRocketSharp } from "react-icons/io5";
import { Card, CardBody, Flex } from "@chakra-ui/react";

const emojis = [
  "💪",
  "✨",
  "🤘",
  "⚔️",
  "🪖",
  "🧗‍♀️",
  "🏌️",
  "🏋️‍♀️",
  "🚴‍♀️",
  "🏄‍♀️",
  "🏃‍♀️",
  "🧘‍♀️",
];

const Intro = () => {
  return (
    <Flex flexDir="column" gap="1rem">
      <p className="text-heading2">
        Welcome back to WarriorWives!{" "}
        {emojis[Math.round(Math.random() * emojis.length)]}
      </p>
      <Card background="gray.100">
        <CardBody>
          <Flex flexDir="column" gap="2rem">
            <div>
              <IconText icon={TbTargetArrow} textClassName="text-heading5 text-lg">
                Purpose
              </IconText>
              <p>
                To be an outreach organization in support of military wives; To
                provide prayer, encouragement and fundamental training resources
                for women that goes beyond the limitations of local, state and
                federal agencies; To unite women with others in their
                geographical area, regardless of branch, duty status or unit
                association; and to promote one another through all stages of
                military service through faith in Jesus Christ.
              </p>
            </div>
            <div>
              <IconText icon={IoRocketSharp} textClassName="text-heading5 text-lg">
                Mission
              </IconText>
              <p>
                Preparing military wives for life's daily battles; through
                prayer, training and relationship-building.
              </p>
            </div>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default Intro;
