import { TypographyH1 } from "../ui/typography/h1";
import GettingStartedCard from "./GettingStartedCard";
import PurposeMissionCard from "./PurposeMissionCard";

const Intro = () => {
  return (
    <div>
      <TypographyH1>Welcome back to Warrior Wives Unite!</TypographyH1>
      <PurposeMissionCard />
      <GettingStartedCard />
    </div>
  );
};

export default Intro;
