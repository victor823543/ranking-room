import React from "react";
import {
  convertRankingSystemToLabel,
  RankingSystem,
  UserRole,
} from "../../../types/Room";
import Breadcrumbs from "../../common/Breadcrumbs/Breadcrumbs";
import Divider from "../../common/Dividers/Dividers";
import { Header } from "../../common/Headers/Headers";
import styles from "./RoomHeader.module.css";

type RoomHeaderProps = {
  id: string;
  name: string;
  rankingSystem: RankingSystem;
  userRole: UserRole;
};

const RoomHeader: React.FC<RoomHeaderProps> = ({
  id,
  name,
  rankingSystem,
  userRole,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbsContainer}>
        <Breadcrumbs
          items={[
            { name: "Rooms", href: "/rooms" },
            { name: name, href: `/rooms/${id}` },
          ]}
        />
        <Divider margin="1rem" color="rgb(var(--base))" />
      </div>
      <Header center={false} as="h1">
        {name}
      </Header>
      <Header center={false} as="h2" variant="secondary">
        {convertRankingSystemToLabel[rankingSystem]}
      </Header>
      <p className={styles.p}>{`Your role: ${userRole}`}</p>
    </div>
  );
};

export default RoomHeader;
