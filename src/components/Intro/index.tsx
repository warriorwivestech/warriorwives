import { TypographyH1 } from "../ui/typography/h1";
import PurposeMissionCard from "./PurposeMissionCard";

const Intro = () => {
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

  return (
    <div>
      <TypographyH1>
        Welcome back to WarriorWives!{" "}
        {emojis[Math.round(Math.random() * emojis.length)]}
      </TypographyH1>
      <PurposeMissionCard />
    </div>
  );
};

export default Intro;
