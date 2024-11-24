import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React from "react";
import { GetRoomResponse } from "../../../types/Room";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import ProgressBar from "../../common/Progress/ProgressBar/ProgressBar";
import styles from "./RankHeader.module.css";

type RankHeaderProps = {
  totalRanked: number;
  leftToRank: number;
  roomData: GetRoomResponse;
  onSubmit: () => void;
  onReload: () => void;
};

const RankHeader: React.FC<RankHeaderProps> = ({
  totalRanked,
  leftToRank,
  roomData,
  onSubmit,
  onReload,
}) => {
  return (
    <header className={styles.rankHeader}>
      <CustomizableButton variant="primary" onClick={onSubmit}>
        Submit Ranking
      </CustomizableButton>
      <div className={styles.rankInfo}>
        <p>{leftToRank} left to rank</p>
        <ProgressBar
          value={totalRanked}
          max={totalRanked + leftToRank}
          animate
        />
        <p>{(totalRanked / (totalRanked + leftToRank) || 0) * 100}%</p>
      </div>
      <button className={styles.reloadBtn} onClick={onReload}>
        <ArrowPathIcon strokeWidth={2} color="rgb(var(--primary))" />
      </button>
    </header>
  );
};

export default RankHeader;
