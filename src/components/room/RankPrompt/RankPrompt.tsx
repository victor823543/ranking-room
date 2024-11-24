import React from "react";
import { useNavigate } from "react-router-dom";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import ProgressBar from "../../common/Progress/ProgressBar/ProgressBar";
import styles from "./RankPrompt.module.css";

type RankPromptProps = {
  totalObjects: number;
  rankedObjects: number;
};

const RankPrompt: React.FC<RankPromptProps> = ({
  totalObjects,
  rankedObjects,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <p
        className={styles.p}
      >{`${totalObjects - rankedObjects} left to rank`}</p>
      <ProgressBar max={totalObjects} value={rankedObjects} />
      <Divider color="rgba(var(--base), 0.5)" margin="1rem" />
      <p className={styles.p}>
        Click to rank the objects or update your ranking
      </p>
      <CustomizableButton
        onClick={() => navigate("rank")}
        style={{ margin: "0 auto" }}
        variant="primary"
      >
        Rank
      </CustomizableButton>
    </div>
  );
};

export default RankPrompt;
