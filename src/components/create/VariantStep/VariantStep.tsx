import React from "react";
import ListSvg from "../../../assets/svgs/ListSvg";
import ScoreRankingSvg from "../../../assets/svgs/ScoreRankingSvg";
import TierListSvg from "../../../assets/svgs/TierListSvg";
import useCreateRoom from "../../../hooks/useCreateRoom";
import { RankingSystem } from "../../../types/Room";
import ChoiceBoxes from "../../common/Boxes/ChoiceBoxes";
import styles from "./VariantStep.module.css";

const boxes = [
  {
    title: "Ranking",
    content: <ListSvg />,
    id: RankingSystem.RANK,
  },
  {
    title: "Tier List",
    content: <TierListSvg />,
    id: RankingSystem.TIER,
  },
  {
    title: "Points",
    content: <ScoreRankingSvg />,
    id: RankingSystem.POINTS,
  },
];

type VariantStepProps = {};

const VariantStep: React.FC<VariantStepProps> = () => {
  const { setRankingSystem, nextStep } = useCreateRoom();
  return (
    <div className={styles.variantStep}>
      <ChoiceBoxes
        boxes={boxes}
        animateOutOnClick
        onClick={({ id }) => setRankingSystem(id as RankingSystem)}
        onAnimateOutComplete={nextStep}
      />
    </div>
  );
};

export default VariantStep;
